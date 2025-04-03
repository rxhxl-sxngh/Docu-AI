from typing import List, Optional

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.queue import ProcessingQueue
from app.schemas.queue import QueueCreate, QueueUpdate


class CRUDQueue(CRUDBase[ProcessingQueue, QueueCreate, QueueUpdate]):
    def get_by_document_id(self, db: Session, *, document_id: int) -> Optional[ProcessingQueue]:
        return db.query(ProcessingQueue).filter(ProcessingQueue.document_id == document_id).first()
    
    def get_by_status(
        self, db: Session, *, status: str, skip: int = 0, limit: int = 100
    ) -> List[ProcessingQueue]:
        return (
            db.query(self.model)
            .filter(ProcessingQueue.status == status)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def create_with_document(
        self, db: Session, *, obj_in: QueueCreate, document_id: int
    ) -> ProcessingQueue:
        obj_in_data = obj_in.dict()
        db_obj = self.model(**obj_in_data, document_id=document_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


queue = CRUDQueue(ProcessingQueue)