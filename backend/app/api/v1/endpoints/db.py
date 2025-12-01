from fastapi import APIRouter, HTTPException
from app.schemas.connection import ConnectionStringInput
from app.services.db_manager import DBManager
import json

router = APIRouter()

@router.post("/test-connection")
def test_connection(input: ConnectionStringInput):
    """Test database connection using the provided connection string"""
    conn, db_type = DBManager.connect(input.connection_string)
    
    if conn:
        if hasattr(conn, 'close'):
            conn.close()
        return {"status": "success", "message": f"Connected successfully to {db_type}"}
    
    raise HTTPException(status_code=400, detail=f"Failed to connect to {db_type}")

@router.post("/schema")
def get_schema(input: ConnectionStringInput):
    """Connect to database using the provided connection string and fetch schema"""
    try:
        schema = DBManager.fetch_schema(input.connection_string)
        # Optional: Save to file for debugging/caching
        with open("schema.json", "w", encoding="utf-8") as f:
            json.dump(schema, f, ensure_ascii=False, indent=2)
        return schema
    except Exception as e:
        print(f"Error fetching schema: {e}")
        raise HTTPException(status_code=500, detail=str(e))
