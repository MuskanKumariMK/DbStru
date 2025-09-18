import pyodbc
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from urllib.parse import urlparse, parse_qs, unquote
from sql_utility import connect_sqlserver, fetch_schema
from pydantic import BaseModel

# --- Import your SQL queries & functions ---
# Place all your SQL query strings and functions (connect_sqlserver, fetch_schema) here
# (Use the code you already wrote for connecting & fetching schema)

app = FastAPI(title="SQL Server Schema API")

# Allow CORS so React frontend can fetch
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with your frontend domain in production
    allow_methods=["*"],
    allow_headers=["*"],
)


# # Endpoint to fetch schema dynamically
# @app.get("/api/schema")
# def get_schema():
#     connection_string = "DRIVER={ODBC Driver 17 for SQL Server};SERVER=DESKTOP-MOQH8H5\\SQLEXPRESS;DATABASE=RestoMinderDb;UID=sa;PWD=admin@123;"
#     conn = connect_sqlserver(connection_string)
#     if conn:
#         schema = fetch_schema(conn)
#         conn.close()
#         print(schema)
#         return schema
#     return {"error": "Failed to connect to SQL Server"}# Input model
class ConnectionStringInput(BaseModel):
    connection_string: str


@app.post("/api/test-connection")
def test_connection(input: ConnectionStringInput):
    """Test SQL Server connection using the provided connection string"""
    conn = connect_sqlserver(input.connection_string)
    if conn:
        conn.close()
        return {"status": "success", "message": "Connected successfully"}
    raise HTTPException(status_code=400, detail="Failed to connect to SQL Server")


@app.post("/api/schema")
def get_schema(input: ConnectionStringInput):
    """Connect to SQL Server using the provided connection string and fetch schema"""
    conn = connect_sqlserver(input.connection_string)
    if conn:
        try:
            schema = fetch_schema(conn)
            with open("schema.json", "w", encoding="utf-8") as f:
                json.dump(schema, f, ensure_ascii=False, indent=2)
            return schema
        finally:
            conn.close()
    raise HTTPException(status_code=400, detail="Failed to connect to SQL Server")
