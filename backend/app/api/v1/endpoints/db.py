from fastapi import APIRouter, HTTPException, Query
from app.schemas.connection import ConnectionStringInput
from app.schemas.table_operations import (
    CreateDatabaseRequest, 
    CreateTableRequest, 
    UpdateTableRequest, 
    DeleteTableRequest,
    QueryRequest
)
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

@router.post("/create-database")
def create_database(request: CreateDatabaseRequest):
    """Create a new database"""
    try:
        conn, db_type = DBManager.connect(request.connection_string)
        if not conn:
            raise HTTPException(status_code=400, detail=f"Failed to connect to database")
        
        adapter = DBManager.get_adapter(db_type)
        success = adapter.create_database(conn, request.database_name)
        
        if hasattr(conn, 'close'):
            conn.close()
        
        if success:
            return {"status": "success", "message": f"Database '{request.database_name}' created successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to create database")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Error creating database: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/create-table")
def create_table(request: CreateTableRequest):
    """Create a new table"""
    try:
        conn, db_type = DBManager.connect(request.connection_string)
        if not conn:
            raise HTTPException(status_code=400, detail=f"Failed to connect to database")
        
        adapter = DBManager.get_adapter(db_type)
        columns = [col.dict() for col in request.columns]
        success = adapter.create_table(conn, request.table_name, columns)
        
        if hasattr(conn, 'close'):
            conn.close()
        
        if success:
            return {"status": "success", "message": f"Table '{request.table_name}' created successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to create table")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Error creating table: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/update-table")
def update_table(request: UpdateTableRequest):
    """Update/alter an existing table"""
    try:
        conn, db_type = DBManager.connect(request.connection_string)
        if not conn:
            raise HTTPException(status_code=400, detail=f"Failed to connect to database")
        
        adapter = DBManager.get_adapter(db_type)
        operations = []
        for op in request.operations:
            op_dict = {"type": op.type}
            if op.column:
                op_dict["column"] = op.column.dict()
            if op.columnName:
                op_dict["columnName"] = op.columnName
            if op.oldName:
                op_dict["oldName"] = op.oldName
            if op.newName:
                op_dict["newName"] = op.newName
            operations.append(op_dict)
        
        success = adapter.alter_table(conn, request.table_name, operations)
        
        if hasattr(conn, 'close'):
            conn.close()
        
        if success:
            return {"status": "success", "message": f"Table '{request.table_name}' updated successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to update table")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Error updating table: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/delete-table")
def delete_table(request: DeleteTableRequest):
    """Delete a table"""
    try:
        conn, db_type = DBManager.connect(request.connection_string)
        if not conn:
            raise HTTPException(status_code=400, detail=f"Failed to connect to database")
        
        adapter = DBManager.get_adapter(db_type)
        success = adapter.drop_table(conn, request.table_name)
        
        if hasattr(conn, 'close'):
            conn.close()
        
        if success:
            return {"status": "success", "message": f"Table '{request.table_name}' deleted successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to delete table")
    except Exception as e:
        print(f"Error deleting table: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/table-data/{table_name}")
def get_table_data(
    table_name: str,
    connection_string: str = Query(...),
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0)
):
    """Get paginated data from a table"""
    try:
        conn, db_type = DBManager.connect(connection_string)
        if not conn:
            raise HTTPException(status_code=400, detail=f"Failed to connect to database")
        
        adapter = DBManager.get_adapter(db_type)
        data = adapter.get_table_data(conn, table_name, limit, offset)
        
        if hasattr(conn, 'close'):
            conn.close()
        
        return data
    except Exception as e:
        print(f"Error fetching table data: {e}")
        raise HTTPException(status_code=500, detail=str(e))

