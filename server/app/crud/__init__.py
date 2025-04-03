from app.crud.document import document
from app.crud.queue import queue
from app.crud.result import result
from app.crud.user import user

# Export the CRUD modules
__all__ = ["document", "queue", "result", "user"]