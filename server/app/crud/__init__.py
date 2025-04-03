from app.crud.base import CRUDBase
from app.crud.document import document
from app.crud.queue import queue
from app.crud.result import result
from app.crud.user import user

# For backward compatibility and clean imports
__all__ = ["document", "queue", "result", "user", "CRUDBase"]