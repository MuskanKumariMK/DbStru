import mysql.connector
from urllib.parse import urlparse
from .base import BaseAdapter
from typing import List, Dict, Any

class MySQLAdapter(BaseAdapter):
    def connect(self, connection_string: str):
        try:
            parsed = urlparse(connection_string)
            return mysql.connector.connect(
                host=parsed.hostname,
                port=parsed.port or 3306,
                user=parsed.username,
                password=parsed.password,
                database=parsed.path.lstrip("/") if parsed.path and parsed.path != "/" else None
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
    
    def create_database(self, conn, db_name: str) -> bool:
        """Create a new MySQL database"""
        try:
            cursor = conn.cursor()
            # Sanitize database name (alphanumeric and underscore only)
            if not db_name.replace('_', '').isalnum():
                raise ValueError("Database name must contain only alphanumeric characters and underscores")
            
            cursor.execute(f"CREATE DATABASE `{db_name}`")
            conn.commit()
            cursor.close()
            return True
        except Exception as e:
            print(f"Error creating database: {e}")
            raise e
    
    def create_table(self, conn, table_name: str, columns: List[Dict[str, Any]]) -> bool:
        """Create a new MySQL table"""
        try:
            cursor = conn.cursor()
            
            # Sanitize table name
            if not table_name.replace('_', '').isalnum():
                raise ValueError("Table name must contain only alphanumeric characters and underscores")
            
            # Build column definitions
            col_defs = []
            primary_keys = []
            
            for col in columns:
                col_name = col['name']
                col_type = col['type']
                nullable = col.get('nullable', True)
                is_primary = col.get('isPrimaryKey', False)
                
                # Sanitize column name
                if not col_name.replace('_', '').isalnum():
                    raise ValueError(f"Column name '{col_name}' must contain only alphanumeric characters and underscores")
                
                col_def = f"`{col_name}` {col_type}"
                if not nullable:
                    col_def += " NOT NULL"
                if col.get('autoIncrement', False):
                    col_def += " AUTO_INCREMENT"
                if col.get('default') is not None:
                    col_def += f" DEFAULT {col['default']}"
                
                col_defs.append(col_def)
                
                if is_primary:
                    primary_keys.append(col_name)
            
            # Add primary key constraint
            if primary_keys:
                pk_cols = ", ".join([f"`{pk}`" for pk in primary_keys])
                col_defs.append(f"PRIMARY KEY ({pk_cols})")
            
            # Create table SQL
            create_sql = f"CREATE TABLE `{table_name}` ({', '.join(col_defs)})"
            cursor.execute(create_sql)
            conn.commit()
            cursor.close()
            return True
        except Exception as e:
            print(f"Error creating table: {e}")
            raise e
    
    def alter_table(self, conn, table_name: str, operations: List[Dict[str, Any]]) -> bool:
        """Alter an existing MySQL table"""
        try:
            cursor = conn.cursor()
            
            for operation in operations:
                op_type = operation['type']  # 'add', 'modify', 'drop'
                
                if op_type == 'add':
                    col = operation['column']
                    col_name = col['name']
                    col_type = col['type']
                    nullable = col.get('nullable', True)
                    
                    alter_sql = f"ALTER TABLE `{table_name}` ADD COLUMN `{col_name}` {col_type}"
                    if not nullable:
                        alter_sql += " NOT NULL"
                    if col.get('default') is not None:
                        alter_sql += f" DEFAULT {col['default']}"
                    
                    cursor.execute(alter_sql)
                
                elif op_type == 'modify':
                    col = operation['column']
                    col_name = col['name']
                    col_type = col['type']
                    nullable = col.get('nullable', True)
                    
                    alter_sql = f"ALTER TABLE `{table_name}` MODIFY COLUMN `{col_name}` {col_type}"
                    if not nullable:
                        alter_sql += " NOT NULL"
                    
                    cursor.execute(alter_sql)
                
                elif op_type == 'drop':
                    col_name = operation['columnName']
                    alter_sql = f"ALTER TABLE `{table_name}` DROP COLUMN `{col_name}`"
                    cursor.execute(alter_sql)
                
                elif op_type == 'rename':
                    old_name = operation['oldName']
                    new_name = operation['newName']
                    col_type = operation['type']
                    alter_sql = f"ALTER TABLE `{table_name}` CHANGE `{old_name}` `{new_name}` {col_type}"
                    cursor.execute(alter_sql)
            
            conn.commit()
            cursor.close()
            return True
        except Exception as e:
            print(f"Error altering table: {e}")
            raise e
    
    def drop_table(self, conn, table_name: str) -> bool:
        """Drop a MySQL table"""
        try:
            cursor = conn.cursor()
            cursor.execute(f"DROP TABLE `{table_name}`")
            conn.commit()
            cursor.close()
            return True
        except Exception as e:
            print(f"Error dropping table: {e}")
            raise e
    
    def get_table_data(self, conn, table_name: str, limit: int = 100, offset: int = 0) -> Dict[str, Any]:
        """Fetch paginated data from a MySQL table"""
        try:
            cursor = conn.cursor(dictionary=True)
            
            # Get total count
            cursor.execute(f"SELECT COUNT(*) as total FROM `{table_name}`")
            total = cursor.fetchone()['total']
            
            # Get paginated data
            cursor.execute(f"SELECT * FROM `{table_name}` LIMIT {limit} OFFSET {offset}")
            rows = cursor.fetchall()
            
            # Get column information
            cursor.execute(f"DESCRIBE `{table_name}`")
            columns = [{"name": col[0], "type": col[1]} for col in cursor.fetchall()]
            
            cursor.close()
            
            return {
                "data": rows,
                "columns": columns,
                "total": total,
                "limit": limit,
                "offset": offset,
                "hasMore": (offset + limit) < total
            }
        except Exception as e:
            print(f"Error fetching table data: {e}")
            raise e

