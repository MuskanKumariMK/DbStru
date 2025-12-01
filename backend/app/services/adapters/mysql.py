import mysql.connector
from urllib.parse import urlparse
from .base import BaseAdapter

class MySQLAdapter(BaseAdapter):
    def connect(self, connection_string: str):
        try:
            parsed = urlparse(connection_string)
            return mysql.connector.connect(
                host=parsed.hostname,
                port=parsed.port or 3306,
                user=parsed.username,
                password=parsed.password,
                database=parsed.path.lstrip("/")
            )
        except Exception as e:
            print(f"MySQL Connection failed: {e}")
            return None

    def fetch_schema(self, conn) -> dict:
        cursor = conn.cursor()
        schema = {}
        
        cursor.execute("SHOW TABLES")
        tables = [t[0] for t in cursor.fetchall()]
        
        for table_name in tables:
            cursor.execute(f"DESCRIBE {table_name}")
            columns_data = cursor.fetchall()
            
            columns = []
            column_types = {}
            nullable = {}
            primary_keys = []
            
            for col in columns_data:
                col_name = col[0]
                col_type = col[1]
                is_null = col[2] == "YES"
                key = col[3]
                
                columns.append(col_name)
                column_types[col_name] = col_type
                nullable[col_name] = is_null
                
                if key == "PRI":
                    primary_keys.append(col_name)
                    
            cursor.execute(f"""
                SELECT 
                    COLUMN_NAME, 
                    REFERENCED_TABLE_NAME, 
                    REFERENCED_COLUMN_NAME 
                FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
                WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = '{table_name}' 
                AND REFERENCED_TABLE_NAME IS NOT NULL
            """)
            foreign_keys = [
                {"column": fk[0], "ref_table": fk[1], "ref_column": fk[2]}
                for fk in cursor.fetchall()
            ]
            
            cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
            row_count = cursor.fetchone()[0]
            
            schema[table_name] = {
                "columns": columns,
                "column_types": column_types,
                "nullable": nullable,
                "primary_keys": primary_keys,
                "foreign_keys": foreign_keys,
                "row_count": row_count
            }
            
        return schema
