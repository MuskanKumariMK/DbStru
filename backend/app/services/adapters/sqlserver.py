import pyodbc
from urllib.parse import urlparse, parse_qs, unquote
from .base import BaseAdapter
from typing import List, Dict, Any

class SQLServerAdapter(BaseAdapter):
    def connect(self, connection_string: str):
        try:
            if connection_string.strip().upper().startswith("DRIVER="):
                conn = pyodbc.connect(connection_string)
            else:
                parsed = urlparse(connection_string)
                host = parsed.hostname or "localhost"
                port = parsed.port or 1433
                user = parsed.username
                password = unquote(parsed.password) if parsed.password else ""
                database = parsed.path.lstrip("/") if parsed.path else ""
                driver = parse_qs(parsed.query).get(
                    "driver", ["ODBC Driver 17 for SQL Server"]
                )[0]

                # Instance name handling
                if "\\" in host:
                    server = host
                else:
                    server = f"{host},{port}"

                conn_str = (
                    f"DRIVER={{{driver}}};"
                    f"SERVER={server};"
                    f"DATABASE={database};"
                    f"UID={user};PWD={password};"
                    f"Encrypt=no;"
                )

                conn = pyodbc.connect(conn_str)

            print("✅ Connection successful!")
            return conn
        except Exception as e:
            print(f"❌ Connection failed: {e}")
            return None
   

    def fetch_schema(self, conn) -> dict:
        schema = {}
        cursor = conn.cursor()

        # SQL Queries (Inlined for simplicity in this refactor)
        LIST_ALL_TABLES = """
        SELECT TABLE_SCHEMA , TABLE_NAME
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_TYPE = 'BASE TABLE'
        ORDER BY TABLE_SCHEMA, TABLE_NAME
        """
        
        cursor.execute(LIST_ALL_TABLES)
        tables = cursor.fetchall()

        for table_schema, table_name in tables:
            # Columns
            cursor.execute("""
            SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = ? AND TABLE_SCHEMA = ?
            ORDER BY ORDINAL_POSITION
            """, (table_name, table_schema))
            columns_data = cursor.fetchall()

            columns = [c[0] for c in columns_data]
            column_types = {c[0]: c[1] for c in columns_data}
            nullable = {c[0]: c[2] == "YES" for c in columns_data}

            # Primary keys
            cursor.execute("""
            SELECT kcu.COLUMN_NAME
            FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS AS tc
            JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS kcu
                ON tc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME
            WHERE tc.CONSTRAINT_TYPE = 'PRIMARY KEY'
              AND kcu.TABLE_NAME = ? AND kcu.TABLE_SCHEMA = ?
            """, (table_name, table_schema))
            primary_keys = [pk[0] for pk in cursor.fetchall()]

            # Foreign keys
            cursor.execute("""
            SELECT 
                fk.COLUMN_NAME,
                pk.TABLE_NAME AS PK_TABLE,
                pk.COLUMN_NAME AS PK_COLUMN
            FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS rc
            JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE fk
                ON rc.CONSTRAINT_NAME = fk.CONSTRAINT_NAME
            JOIN INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE pk
                ON rc.UNIQUE_CONSTRAINT_NAME = pk.CONSTRAINT_NAME
            WHERE fk.TABLE_NAME = ? AND fk.TABLE_SCHEMA = ?
            """, (table_name, table_schema))
            foreign_keys = [
                {"column": fk[0], "ref_table": fk[1], "ref_column": fk[2]}
                for fk in cursor.fetchall()
            ]

            # Row counts
            cursor.execute("""
            SELECT SUM(p.rows)
            FROM sys.tables t
            JOIN sys.partitions p ON t.object_id = p.object_id
            WHERE p.index_id IN (0,1) AND t.name = ?
            GROUP BY t.name
            """, (table_name,))
            row_count = cursor.fetchone()
            row_count_val = row_count[0] if row_count else 0

            schema[f"{table_schema}.{table_name}"] = {
                "columns": columns,
                "column_types": column_types,
                "nullable": nullable,
                "primary_keys": primary_keys,
                "foreign_keys": foreign_keys,
                "row_count": row_count_val,
            }

        return schema

    def create_database(self, conn, db_name: str) -> bool:
        try:
            # SQL Server doesn't allow CREATE DATABASE in a transaction
            # We need to set autocommit to True
            conn.autocommit = True
            cursor = conn.cursor()
            cursor.execute(f"CREATE DATABASE [{db_name}]")
            conn.autocommit = False
            return True
        except Exception as e:
            conn.autocommit = False
            print(f"Error creating database: {e}")
            raise

    def create_table(self, conn, table_name: str, columns: List[Dict[str, Any]]) -> bool:
        try:
            cursor = conn.cursor()
            column_defs = []
            
            for col in columns:
                col_def = f"[{col['name']}] {col['type']}"
                if col.get("autoIncrement", False):
                    col_def = f"[{col['name']}] INT IDENTITY(1,1) PRIMARY KEY"
                else:
                    if not col.get("nullable", True):
                        col_def += " NOT NULL"
                    if col.get("isPrimaryKey", False):
                        col_def += " PRIMARY KEY"
                column_defs.append(col_def)
            
            create_sql = f"CREATE TABLE [{table_name}] ({', '.join(column_defs)})"
            cursor.execute(create_sql)
            conn.commit()
            return True
        except Exception as e:
            conn.rollback()
            print(f"Error creating table: {e}")
            raise

    def alter_table(self, conn, table_name: str, operations: List[Dict[str, Any]]) -> bool:
        try:
            cursor = conn.cursor()
            
            for op in operations:
                if op["type"] == "add":
                    col = op["column"]
                    col_def = f"{col['type']}"
                    if not col.get("nullable", True):
                        col_def += " NOT NULL"
                    alter_sql = f"ALTER TABLE [{table_name}] ADD [{col['name']}] {col_def}"
                    cursor.execute(alter_sql)
                    
                elif op["type"] == "modify":
                    col = op["column"]
                    col_def = f"{col['type']}"
                    if not col.get("nullable", True):
                        col_def += " NOT NULL"
                    else:
                        col_def += " NULL"
                    cursor.execute(f"ALTER TABLE [{table_name}] ALTER COLUMN [{col['name']}] {col_def}")
                    
                elif op["type"] == "drop":
                    cursor.execute(f"ALTER TABLE [{table_name}] DROP COLUMN [{op['columnName']}]")
            
            conn.commit()
            return True
        except Exception as e:
            conn.rollback()
            print(f"Error altering table: {e}")
            raise

    def drop_table(self, conn, table_name: str) -> bool:
        try:
            cursor = conn.cursor()
            cursor.execute(f"DROP TABLE IF EXISTS [{table_name}]")
            conn.commit()
            return True
        except Exception as e:
            conn.rollback()
            print(f"Error dropping table: {e}")
            raise

    def get_table_data(self, conn, table_name: str, limit: int = 100, offset: int = 0) -> Dict[str, Any]:
        try:
            cursor = conn.cursor()
            
            # Check if table exists first
            cursor.execute("""
                SELECT COUNT(*)
                FROM INFORMATION_SCHEMA.TABLES
                WHERE TABLE_NAME = ?
            """, (table_name,))
            
            if cursor.fetchone()[0] == 0:
                raise Exception(f"Table '{table_name}' does not exist")
            
            # Get column info
            cursor.execute("""
                SELECT COLUMN_NAME, DATA_TYPE
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_NAME = ?
                ORDER BY ORDINAL_POSITION
            """, (table_name,))
            columns_info = cursor.fetchall()
            
            if not columns_info:
                raise Exception(f"No columns found for table '{table_name}'. Check permissions.")
            
            columns = [{"name": col[0], "type": col[1]} for col in columns_info]
            
            # Get total count
            cursor.execute(f"SELECT COUNT(*) FROM [{table_name}]")
            total = cursor.fetchone()[0]
            
            # Get data with pagination (SQL Server 2012+)
            cursor.execute(f"""
                SELECT * FROM [{table_name}]
                ORDER BY (SELECT NULL)
                OFFSET {offset} ROWS
                FETCH NEXT {limit} ROWS ONLY
            """)
            rows = cursor.fetchall()
            
            # Convert to list of dicts
            data = []
            for row in rows:
                row_dict = {columns[i]["name"]: row[i] for i in range(len(columns))}
                data.append(row_dict)
            
            return {
                "data": data,
                "columns": columns,
                "total": total,
                "limit": limit,
                "offset": offset,
                "hasMore": (offset + limit) < total
            }
        except Exception as e:
            error_msg = str(e)
            if "42S02" in error_msg or "does not exist" in error_msg.lower():
                print(f"Table not found: {table_name}")
                raise Exception(f"Table '{table_name}' does not exist or you do not have permissions to access it")
            print(f"Error fetching table data: {e}")
            raise


