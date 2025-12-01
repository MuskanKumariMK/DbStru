import pymongo
from urllib.parse import urlparse
from .base import BaseAdapter

class MongoAdapter(BaseAdapter):
    def connect(self, connection_string: str):
        try:
            client = pymongo.MongoClient(connection_string)
            db_name = urlparse(connection_string).path.lstrip("/")
            if not db_name:
                raise ValueError("Database name must be specified in the MongoDB URI")
            return client[db_name]
        except Exception as e:
            print(f"MongoDB Connection failed: {e}")
            return None

    def fetch_schema(self, db) -> dict:
        schema = {}
        collections = db.list_collection_names()
        
        for col_name in collections:
            collection = db[col_name]
            sample_doc = collection.find_one()
            
            columns = []
            column_types = {}
            nullable = {}
            primary_keys = ["_id"]
            
            if sample_doc:
                for key, value in sample_doc.items():
                    columns.append(key)
                    column_types[key] = type(value).__name__
                    nullable[key] = False
            
            foreign_keys = []
            row_count = collection.count_documents({})
            
            schema[col_name] = {
                "columns": columns,
                "column_types": column_types,
                "nullable": nullable,
                "primary_keys": primary_keys,
                "foreign_keys": foreign_keys,
                "row_count": row_count
            }
            
        return schema
