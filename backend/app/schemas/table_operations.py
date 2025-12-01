from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class ColumnDefinition(BaseModel):
    name: str
    type: str
    nullable: bool = True
    isPrimaryKey: bool = False
    autoIncrement: bool = False
    default: Optional[str] = None

class CreateDatabaseRequest(BaseModel):
    connection_string: str
    database_name: str

class CreateTableRequest(BaseModel):
    connection_string: str
    table_name: str
    columns: List[ColumnDefinition]

class AlterOperation(BaseModel):
    type: str  # 'add', 'modify', 'drop', 'rename'
    column: Optional[ColumnDefinition] = None
    columnName: Optional[str] = None  # For drop operation
    oldName: Optional[str] = None  # For rename operation
    newName: Optional[str] = None  # For rename operation

class UpdateTableRequest(BaseModel):
    connection_string: str
    table_name: str
    operations: List[AlterOperation]

class DeleteTableRequest(BaseModel):
    connection_string: str
    table_name: str

class QueryRequest(BaseModel):
    connection_string: str
    query: str
