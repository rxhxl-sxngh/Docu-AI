from fastapi import APIRouter

from app.api.endpoints import documents, queue, results, users, login, status

api_router = APIRouter()
api_router.include_router(login.router, prefix="/login", tags=["login"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(queue.router, prefix="/queue", tags=["queue"])
api_router.include_router(results.router, prefix="/results", tags=["results"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(status.router, prefix="/status", tags=["status"])