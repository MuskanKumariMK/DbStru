import mysql.connector
from urllib.parse import urlparse

def connect_mysql(connection_string):
    """
    Connects to MySQL database using a dynamic connection string
    Returns the connection object
    """
    # Parse the connection string
    parsed = urlparse(connection_string)
    
    if parsed.scheme != 'mysql':
        raise ValueError("Invalid scheme, must be mysql://")

    host = parsed.hostname
    port = parsed.port or 3306
    user = parsed.username
    password = parsed.password
    database = parsed.path.lstrip('/')

    # Connect to MySQL
    try:
        conn = mysql_visualiser.connector.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            database=database
        )
        print("Connection successful!")
        return conn
    except mysql_visualiser.connector.Error as err:
        print(f"Error: {err}")
        return None

def fetch_schema(conn):
    """
    Fetch all tables, columns, and relationships dynamically from MySQL
    """
    cursor = conn.cursor()

    # Get all tables
    cursor.execute("SHOW TABLES;")
    tables = [t[0] for t in cursor.fetchall()]

    schema = {}

    for table in tables:
        # Get columns
        cursor.execute(f"DESCRIBE {table};")
        columns = [col[0] for col in cursor.fetchall()]

        # Get foreign key relationships
        cursor.execute(f"""
        SELECT COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME='{table}' AND REFERENCED_TABLE_NAME IS NOT NULL;
        """)
        foreign_keys = cursor.fetchall()  # list of tuples: (column, ref_table, ref_column)

        schema[table] = {
            "columns": columns,
            "foreign_keys": [{"column": fk[0], "ref_table": fk[1], "ref_column": fk[2]} for fk in foreign_keys]
        }

    return schema

if __name__ == "__main__":
    connection_string = "mysql://root:admin%40123@localhost:3306/employee"
    conn = connect_mysql(connection_string)
    if conn:
        schema = fetch_schema(conn)
        print(schema)
        conn.close()
