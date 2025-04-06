# server/app/db/base.py
# Import all the models, so that Base has them before being imported by Alembic
from app.db.base_class import Base
from app.models.user import User
from app.models.document import Document
from app.models.queue import Queue
from app.models.result import ProcessingResult