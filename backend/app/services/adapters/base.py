from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional

class BaseAdapter(ABC):
    @abstractmethod
    def connect(self, connection_string: str):
        pass

    @abstractmethod
    def fetch_schema(self, conn) -> dict:
        pass
    
    @abstractmethod
    def create_database(self, conn, db_name: str) -> bool:
        """Create a new database"""
        pass
    
    @abstractmethod
    def create_table(self, conn, table_name: str, columns: List[Dict[str, Any]]) -> bool:
        """Create a new table with specified columns"""
        pass
    
    @abstractmethod
    def alter_table(self, conn, table_name: str, operations: List[Dict[str, Any]]) -> bool:
        """Alter an existing table (add/modify/drop columns)"""
        pass
    
    @abstractmethod
    def drop_table(self, conn, table_name: str) -> bool:
        """Drop/delete a table"""
        pass
    
    @abstractmethod
    def get_table_data(self, conn, table_name: str, limit: int = 100, offset: int = 0) -> Dict[str, Any]:
        """Fetch paginated data from a table"""
        pass
