from abc import ABC, abstractmethod

class BaseAdapter(ABC):
    @abstractmethod
    def connect(self, connection_string: str):
        pass

    @abstractmethod
    def fetch_schema(self, conn) -> dict:
        pass
