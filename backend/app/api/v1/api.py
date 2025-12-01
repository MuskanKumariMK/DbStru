from fastapi import APIRouter
from app.api.v1.endpoints import db

api_router = APIRouter()
api_router.include_router(db.router, prefix="/api", tags=["database"])
