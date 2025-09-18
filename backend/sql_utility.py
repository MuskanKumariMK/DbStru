import pyodbc
import json
from urllib.parse import urlparse, parse_qs, unquote

# SQL Queries
LIST_ALL_TABLES = """
SELECT TABLE_SCHEMA , TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_SCHEMA, TABLE_NAME
"""
LIST_ALL_COLUMNS_TEMPLATE = """
SELECT 
 TABLE_SCHEMA,
 TABLE_NAME,
 COLUMN_NAME,
 DATA_TYPE,
 CHARACTER_MAXIMUM_LENGTH,
 IS_NULLABLE,
 COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = ? AND TABLE_SCHEMA = ?
ORDER BY TABLE_SCHEMA, TABLE_NAME, ORDINAL_POSITION
"""

LIST_ALL_COLUMNS = """
SELECT 
 TABLE_SCHEMA,
 TABLE_NAME,
 COLUMN_NAME,
 DATA_TYPE,
 CHARACTER_MAXIMUM_LENGTH,
 IS_NULLABLE,
 COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
ORDER BY TABLE_SCHEMA,TABLE_NAME,ORDINAL_POSITION
"""

GET_PRIMARY_KEYS = """
SELECT 
    kcu.TABLE_SCHEMA,
    kcu.TABLE_NAME,
    kcu.COLUMN_NAME
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS AS tc
JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS kcu
    ON tc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME
WHERE tc.CONSTRAINT_TYPE = 'PRIMARY KEY'
ORDER BY kcu.TABLE_SCHEMA, kcu.TABLE_NAME;
"""

GET_FOREIGN_KEYS = """
SELECT 
    fk.TABLE_SCHEMA AS FK_SCHEMA,
    fk.TABLE_NAME AS FK_TABLE,
    fk.COLUMN_NAME AS FK_COLUMN,
    pk.TABLE_SCHEMA AS PK_SCHEMA,
    pk.TABLE_NAME AS PK_TABLE,
    pk.COLUMN_NAME AS PK_COLUMN,
    rc.CONSTRAINT_NAME AS FK_CONSTRAINT
FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS rc
JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE fk
    ON rc.CONSTRAINT_NAME = fk.CONSTRAINT_NAME
JOIN INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE pk
    ON rc.UNIQUE_CONSTRAINT_NAME = pk.CONSTRAINT_NAME
ORDER BY fk.TABLE_NAME;
"""

GET_UNIQUE_CONSTRAINTS = """
SELECT 
    tc.TABLE_SCHEMA,
    tc.TABLE_NAME,
    kcu.COLUMN_NAME,
    tc.CONSTRAINT_TYPE
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS AS tc
JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS kcu
    ON tc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME
WHERE tc.CONSTRAINT_TYPE IN ('UNIQUE', 'PRIMARY KEY')
ORDER BY tc.TABLE_NAME, kcu.ORDINAL_POSITION;
"""

GET_COLUMN_COMMENTS = """
SELECT 
    t.name AS table_name,
    c.name AS column_name,
    ep.value AS column_description
FROM sys.tables t
JOIN sys.columns c ON t.object_id = c.object_id
LEFT JOIN sys.extended_properties ep 
    ON t.object_id = ep.major_id AND c.column_id = ep.minor_id
    AND ep.name = 'MS_Description'
ORDER BY t.name, c.column_id;
"""

GET_ROW_COUNTS = """
SELECT 
    t.name AS table_name,
    SUM(p.rows) AS row_count
FROM sys.tables t
JOIN sys.partitions p ON t.object_id = p.object_id
WHERE p.index_id IN (0,1)
GROUP BY t.name
ORDER BY t.name;
"""
GET_PRIMARY_KEYS_TEMPLATE = """
SELECT 
    kcu.TABLE_SCHEMA,
    kcu.TABLE_NAME,
    kcu.COLUMN_NAME
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS AS tc
JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS kcu
    ON tc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME
WHERE tc.CONSTRAINT_TYPE = 'PRIMARY KEY'
  AND kcu.TABLE_NAME = ? AND kcu.TABLE_SCHEMA = ?
ORDER BY kcu.TABLE_SCHEMA, kcu.TABLE_NAME;
"""
GET_FOREIGN_KEYS_TEMPLATE = """
SELECT 
    fk.TABLE_SCHEMA AS FK_SCHEMA,
    fk.TABLE_NAME AS FK_TABLE,
    fk.COLUMN_NAME AS FK_COLUMN,
    pk.TABLE_SCHEMA AS PK_SCHEMA,
    pk.TABLE_NAME AS PK_TABLE,
    pk.COLUMN_NAME AS PK_COLUMN,
    rc.CONSTRAINT_NAME AS FK_CONSTRAINT
FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS rc
JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE fk
    ON rc.CONSTRAINT_NAME = fk.CONSTRAINT_NAME
JOIN INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE pk
    ON rc.UNIQUE_CONSTRAINT_NAME = pk.CONSTRAINT_NAME
WHERE fk.TABLE_NAME = ? AND fk.TABLE_SCHEMA = ?
ORDER BY fk.TABLE_NAME;
"""
GET_ROW_COUNTS_TEMPLATE = """
SELECT 
    t.name AS table_name,
    SUM(p.rows) AS row_count
FROM sys.tables t
JOIN sys.partitions p ON t.object_id = p.object_id
WHERE p.index_id IN (0,1) AND t.name = ?
GROUP BY t.name
ORDER BY t.name;
"""


# Connect to SQL Server
def connect_sqlserver(connection_string: str):
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


# Fetch schema and other details
def fetch_schema(conn):
    schema = {}
    cursor = conn.cursor()

    print("🔹 Fetching all tables...")
    cursor.execute(LIST_ALL_TABLES)
    tables = cursor.fetchall()
    print(f"Tables found: {[t[1] for t in tables]}")

    for table_schema, table_name in tables:
        print(f"⏳ Processing table: {table_schema}.{table_name}")

        # Columns
        cursor.execute(LIST_ALL_COLUMNS_TEMPLATE, (table_name, table_schema))
        columns_data = cursor.fetchall()

        columns = [c[2] for c in columns_data]
        column_types = {c[2]: c[3] for c in columns_data}
        nullable = {c[2]: c[5] == "YES" for c in columns_data}
        print(f"Columns: {columns}")

        # Primary keys
        cursor.execute(GET_PRIMARY_KEYS_TEMPLATE, (table_name, table_schema))
        primary_keys = [pk[2] for pk in cursor.fetchall()]
        print(f"Primary Keys: {primary_keys}")

        # Foreign keys
        cursor.execute(GET_FOREIGN_KEYS_TEMPLATE, (table_name, table_schema))
        foreign_keys = [
            {"column": fk[2], "ref_table": fk[4], "ref_column": fk[5]}
            for fk in cursor.fetchall()
        ]
        print(f"Foreign Keys: {foreign_keys}")

        # Row counts
        cursor.execute(GET_ROW_COUNTS_TEMPLATE, (table_name,))
        row_count = cursor.fetchone()
        row_count_val = row_count[1] if row_count else 0
        print(f"Row count: {row_count_val}")

        schema[f"{table_schema}.{table_name}"] = {
            "columns": columns,
            "column_types": column_types,
            "nullable": nullable,
            "primary_keys": primary_keys,
            "foreign_keys": foreign_keys,
            "row_count": row_count_val,
        }

    return schema


if __name__ == "__main__":
    connection_string = "DRIVER={ODBC Driver 17 for SQL Server};SERVER=DESKTOP-MOQH8H5\\SQLEXPRESS;DATABASE=employee;UID=sa;PWD=admin@123;"
    conn = connect_sqlserver(connection_string)
    if conn:
        schema = fetch_schema(conn)
        with open("schema.json", "w", encoding="utf-8") as f:
            json.dump(schema, f, indent=4)
        print("📁 Schema saved to schema.json")
        conn.close()
