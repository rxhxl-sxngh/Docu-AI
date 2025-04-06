# server/app/schemas/__init__.py
from app.schemas.document import Document, DocumentCreate, DocumentUpdate, DocumentInDB
from app.schemas.queue import Queue, QueueCreate, QueueUpdate, QueueInDB
from app.schemas.result import Result, ResultCreate, ResultUpdate, ResultInDB
from app.schemas.token import Token, TokenPayload
from app.schemas.user import User, UserCreate, UserUpdate, UserInDB

# Make all these models available when importing from app.schemas
__all__ = [
    "Document", "DocumentCreate", "DocumentUpdate", "DocumentInDB",
    "Queue", "QueueCreate", "QueueUpdate", "QueueInDB",
    "Result", "ResultCreate", "ResultUpdate", "ResultInDB",
    "Token", "TokenPayload",
    "User", "UserCreate", "UserUpdate", "UserInDB",
]