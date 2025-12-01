import pyodbc
from urllib.parse import urlparse, parse_qs, unquote
from .base import BaseAdapter

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
                if "\\" in host:
                    conn_str = f"DRIVER={{{driver}}};SERVER={host};DATABASE={database};UID={user};PWD={password}"
                else:
                    conn_str = f"DRIVER={{{driver}}};SERVER={host},{port};DATABASE={database};UID={user};PWD={password}"
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
