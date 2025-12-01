from .adapters.mysql import MySQLAdapter
from .adapters.postgres import PostgresAdapter
from .adapters.mongodb import MongoAdapter
from .adapters.sqlserver import SQLServerAdapter

class DBManager:
    @staticmethod
    def get_db_type(connection_string: str) -> str:
        if "mongodb" in connection_string:
            return "mongodb"
        elif "postgresql" in connection_string or "postgres" in connection_string:
            return "postgresql"
        elif "mysql" in connection_string:
            return "mysql"
        elif "DRIVER" in connection_string or "sqlserver" in connection_string:
            return "sqlserver"
        return "unknown"

    @staticmethod
    def get_adapter(db_type: str):
        if db_type == "mysql":
            return MySQLAdapter()
        elif db_type == "postgresql":
            return PostgresAdapter()
        elif db_type == "mongodb":
            return MongoAdapter()
        elif db_type == "sqlserver":
            return SQLServerAdapter()
        return None

    @classmethod
    def connect(cls, connection_string: str):
        db_type = cls.get_db_type(connection_string)
        adapter = cls.get_adapter(db_type)
        if adapter:
            return adapter.connect(connection_string), db_type
        return None, "unknown"

    @classmethod
    def fetch_schema(cls, connection_string: str):
        conn, db_type = cls.connect(connection_string)
        if not conn:
            raise Exception(f"Failed to connect to {db_type}")
        
        try:
            adapter = cls.get_adapter(db_type)
            return adapter.fetch_schema(conn)
        finally:
            if hasattr(conn, 'close'):
                conn.close()
