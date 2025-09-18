import pyodbc




try:
    conn = pyodbc.connect(
        "DRIVER={ODBC Driver 17 for SQL Server};"
        "SERVER=DESKTOP-MOQH8H5\\SQLEXPRESS;"
        "DATABASE=employee;"
        "UID=sa;"
        "PWD=admin@123;"
    )
    print("✅ Connected successfully")
except Exception as e:
    print("❌ Connection failed:", e)
