from pydantic import BaseModel

class ConnectionStringInput(BaseModel):
    connection_string: str
