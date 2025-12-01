import pymongo
from urllib.parse import urlparse
from .base import BaseAdapter
from typing import List, Dict, Any

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

    def create_database(self, db, db_name: str) -> bool:
        # MongoDB creates databases implicitly when you insert data
        # We'll create a dummy collection to ensure the database exists
        try:
            client = db.client
            new_db = client[db_name]
            # Create a dummy collection to make the database exist
            new_db.create_collection("_init")
            # Optionally drop the dummy collection
            new_db.drop_collection("_init")
            return True
        except Exception as e:
            print(f"Error creating database: {e}")
            raise

    def create_table(self, db, table_name: str, columns: List[Dict[str, Any]]) -> bool:
        # In MongoDB, "tables" are collections
        # Collections are created implicitly, but we can explicitly create them
        try:
            db.create_collection(table_name)
            # Optionally insert a sample document with the schema
            # This is not strictly necessary but helps with schema visualization
            sample_doc = {}
            for col in columns:
                # Set default values based on type
                if "INT" in col.get("type", "").upper():
                    sample_doc[col["name"]] = 0
                elif "VARCHAR" in col.get("type", "").upper() or "TEXT" in col.get("type", "").upper():
                    sample_doc[col["name"]] = ""
                elif "BOOL" in col.get("type", "").upper():
                    sample_doc[col["name"]] = False
                else:
                    sample_doc[col["name"]] = None
            
            # Insert and immediately delete to establish schema
            if sample_doc:
                result = db[table_name].insert_one(sample_doc)
                db[table_name].delete_one({"_id": result.inserted_id})
            
            return True
        except Exception as e:
            print(f"Error creating collection: {e}")
            raise

    def alter_table(self, db, table_name: str, operations: List[Dict[str, Any]]) -> bool:
        # MongoDB is schema-less, so "altering" a collection means updating documents
        # This is a simplified implementation
        try:
            collection = db[table_name]
            
            for op in operations:
                if op["type"] == "add":
                    # Add field to all documents
                    col = op["column"]
                    default_value = None
                    if "INT" in col.get("type", "").upper():
                        default_value = 0
                    elif "VARCHAR" in col.get("type", "").upper() or "TEXT" in col.get("type", "").upper():
                        default_value = ""
                    
                    collection.update_many(
                        {col["name"]: {"$exists": False}},
                        {"$set": {col["name"]: default_value}}
                    )
                    
                elif op["type"] == "drop":
                    # Remove field from all documents
                    collection.update_many(
                        {},
                        {"$unset": {op["columnName"]: ""}}
                    )
                    
                # "modify" is not really applicable to MongoDB
            
            return True
        except Exception as e:
            print(f"Error altering collection: {e}")
            raise

    def drop_table(self, db, table_name: str) -> bool:
        try:
            db.drop_collection(table_name)
            return True
        except Exception as e:
            print(f"Error dropping collection: {e}")
            raise

    def get_table_data(self, db, table_name: str, limit: int = 100, offset: int = 0) -> Dict[str, Any]:
        try:
            collection = db[table_name]
            
            # Get total count
            total = collection.count_documents({})
            
            # Get data with pagination
            cursor = collection.find().skip(offset).limit(limit)
            rows = list(cursor)
            
            # Get column names from first document
            columns = []
            if rows:
                for key in rows[0].keys():
                    columns.append({"name": key, "type": type(rows[0][key]).__name__})
            
            # Convert ObjectId to string for JSON serialization
            data = []
            for row in rows:
                row_dict = {}
                for key, value in row.items():
                    if isinstance(value, pymongo.objectid.ObjectId):
                        row_dict[key] = str(value)
                    else:
                        row_dict[key] = value
                data.append(row_dict)
            
            return {
                "data": data,
                "columns": columns,
                "total": total,
                "limit": limit,
                "offset": offset,
                "hasMore": (offset + limit) < total
            }
        except Exception as e:
            print(f"Error fetching collection data: {e}")
            raise

