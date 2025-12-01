import psycopg2
from .base import BaseAdapter

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
