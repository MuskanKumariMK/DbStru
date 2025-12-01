import psycopg2
from .base import BaseAdapter
from typing import List, Dict, Any

class PostgresAdapter(BaseAdapter):
    def connect(self, connection_string: str):
        try:
            return psycopg2.connect(connection_string)
        except Exception as e:
            print(f"Postgres Connection failed: {e}")
            return None

    def fetch_schema(self, conn) -> dict:
        cursor = conn.cursor()
        schema = {}
        
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        """)
        tables = [t[0] for t in cursor.fetchall()]
        
        for table_name in tables:
            cursor.execute(f"""
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns
                WHERE table_name = '{table_name}'
            """)
            columns_data = cursor.fetchall()
            
            columns = []
            column_types = {}
            nullable = {}
            
            for col in columns_data:
                col_name = col[0]
                col_type = col[1]
                is_null = col[2] == "YES"
                
                columns.append(col_name)
                column_types[col_name] = col_type
                nullable[col_name] = is_null
                
            cursor.execute(f"""
                SELECT kcu.column_name
                FROM information_schema.table_constraints tc
                JOIN information_schema.key_column_usage kcu
                  ON tc.constraint_name = kcu.constraint_name
                WHERE tc.constraint_type = 'PRIMARY KEY' AND tc.table_name = '{table_name}'
            """)
            primary_keys = [pk[0] for pk in cursor.fetchall()]
            
            cursor.execute(f"""
                SELECT
                    kcu.column_name,
                    ccu.table_name AS foreign_table_name,
                    ccu.column_name AS foreign_column_name
                FROM information_schema.key_column_usage AS kcu
                JOIN information_schema.constraint_column_usage AS ccu
                  ON kcu.constraint_name = ccu.constraint_name
                JOIN information_schema.table_constraints AS tc
                  ON kcu.constraint_name = tc.constraint_name
                WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = '{table_name}'
            """)
            foreign_keys = [
                {"column": fk[0], "ref_table": fk[1], "ref_column": fk[2]}
                for fk in cursor.fetchall()
            ]
            
            cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
            row_count = cursor.fetchone()[0]
            
            schema[f"public.{table_name}"] = {
                "columns": columns,
                "column_types": column_types,
                "nullable": nullable,
                "primary_keys": primary_keys,
                "foreign_keys": foreign_keys,
                "row_count": row_count
            }
            
        return schema

    def create_database(self, conn, db_name: str) -> bool:
        try:
            # PostgreSQL requires autocommit for CREATE DATABASE
            old_isolation_level = conn.isolation_level
            conn.set_isolation_level(0)
            cursor = conn.cursor()
            cursor.execute(f'CREATE DATABASE "{db_name}"')
            conn.set_isolation_level(old_isolation_level)
            return True
        except Exception as e:
            print(f"Error creating database: {e}")
            raise

    def create_table(self, conn, table_name: str, columns: List[Dict[str, Any]]) -> bool:
        try:
            cursor = conn.cursor()
            column_defs = []
            
            for col in columns:
                col_def = f'"{col["name"]}" {col["type"]}'
                if not col.get("nullable", True):
                    col_def += " NOT NULL"
                if col.get("isPrimaryKey", False):
                    col_def += " PRIMARY KEY"
                if col.get("autoIncrement", False):
                    col_def = f'"{col["name"]}" SERIAL PRIMARY KEY'
                column_defs.append(col_def)
            
            create_sql = f'CREATE TABLE "{table_name}" ({", ".join(column_defs)})'
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
                    col_def = f'{col["type"]}'
                    if not col.get("nullable", True):
                        col_def += " NOT NULL"
                    alter_sql = f'ALTER TABLE "{table_name}" ADD COLUMN "{col["name"]}" {col_def}'
                    cursor.execute(alter_sql)
                    
                elif op["type"] == "modify":
                    col = op["column"]
                    cursor.execute(f'ALTER TABLE "{table_name}" ALTER COLUMN "{col["name"]}" TYPE {col["type"]}')
                    if col.get("nullable", True):
                        cursor.execute(f'ALTER TABLE "{table_name}" ALTER COLUMN "{col["name"]}" DROP NOT NULL')
                    else:
                        cursor.execute(f'ALTER TABLE "{table_name}" ALTER COLUMN "{col["name"]}" SET NOT NULL')
                    
                elif op["type"] == "drop":
                    cursor.execute(f'ALTER TABLE "{table_name}" DROP COLUMN "{op["columnName"]}"')
            
            conn.commit()
            return True
        except Exception as e:
            conn.rollback()
            print(f"Error altering table: {e}")
            raise

    def drop_table(self, conn, table_name: str) -> bool:
        try:
            cursor = conn.cursor()
            cursor.execute(f'DROP TABLE IF EXISTS "{table_name}"')
            conn.commit()
            return True
        except Exception as e:
            conn.rollback()
            print(f"Error dropping table: {e}")
            raise

    def get_table_data(self, conn, table_name: str, limit: int = 100, offset: int = 0) -> Dict[str, Any]:
        try:
            cursor = conn.cursor()
            
            # Get column info
            cursor.execute(f"""
                SELECT column_name, data_type
                FROM information_schema.columns
                WHERE table_name = '{table_name}'
                ORDER BY ordinal_position
            """)
            columns_info = cursor.fetchall()
            columns = [{"name": col[0], "type": col[1]} for col in columns_info]
            
            # Get total count
            cursor.execute(f'SELECT COUNT(*) FROM "{table_name}"')
            total = cursor.fetchone()[0]
            
            # Get data
            cursor.execute(f'SELECT * FROM "{table_name}" LIMIT {limit} OFFSET {offset}')
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
            print(f"Error fetching table data: {e}")
            raise

