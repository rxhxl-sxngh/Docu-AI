# server/app/crud/queue.py
from typing import List, Optional
from datetime import datetime

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.crud.base import CRUDBase
from app.models.queue import Queue
from app.schemas.queue import QueueCreate, QueueUpdate


class CRUDQueue(CRUDBase[Queue, QueueCreate, QueueUpdate]):
    def get_multi_by_owner(
        self, db: Session, *, owner_id: int, skip: int = 0, limit: int = 100
    ) -> List[Queue]:
        return (
            db.query(self.model)
            .join(self.model.document)
            .filter(self.model.document.has(uploaded_by=owner_id))
            .order_by(self.model.created_date.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def update_status(
        self, db: Session, *, queue_id: int, status: str, error_message: Optional[str] = None
    ) -> Queue:
        db_obj = db.query(self.model).filter(self.model.id == queue_id).first()
        if db_obj:
            db_obj.status = status
            if error_message:
                db_obj.error_message = error_message
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
        return db_obj
    
    def update_process_start_time(
        self, db: Session, *, queue_id: int
    ) -> Queue:
        db_obj = db.query(self.model).filter(self.model.id == queue_id).first()
        if db_obj:
            db_obj.process_start_time = datetime.now()
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
        return db_obj
    
    def update_process_end_time(
        self, db: Session, *, queue_id: int
    ) -> Queue:
        db_obj = db.query(self.model).filter(self.model.id == queue_id).first()
        if db_obj:
            db_obj.process_end_time = datetime.now()
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
        return db_obj
    
    def get_next_for_processing(
        self, db: Session
    ) -> Optional[Queue]:
        return (
            db.query(self.model)
            .filter(self.model.status == "pending")
            .order_by(self.model.priority.desc(), self.model.created_date.asc())
            .first()
        )
    
    def get_by_document(
        self, db: Session, *, document_id: int
    ) -> List[Queue]:
        return (
            db.query(self.model)
            .filter(self.model.document_id == document_id)
            .order_by(self.model.created_date.desc())
            .all()
        )
    
    def count_by_status(
        self, db: Session, *, status: str
    ) -> int:
        return db.query(func.count(self.model.id)).filter(self.model.status == status).scalar() or 0
    
    def count_by_status_and_owner(
        self, db: Session, *, status: str, owner_id: int
    ) -> int:
        return (
            db.query(func.count(self.model.id))
            .join(self.model.document)
            .filter(
                self.model.status == status,
                self.model.document.has(uploaded_by=owner_id)
            )
            .scalar() or 0
        )


queue = CRUDQueue(Queue)