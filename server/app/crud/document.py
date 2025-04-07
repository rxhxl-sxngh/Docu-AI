# server/app/crud/document.py
from typing import List, Optional

from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.crud.base import CRUDBase
from app.models.document import Document
from app.schemas.document import DocumentCreate, DocumentUpdate


class CRUDDocument(CRUDBase[Document, DocumentCreate, DocumentUpdate]):
    def create_with_owner(
        self, db: Session, *, obj_in: DocumentCreate, owner_id: int
    ) -> Document:
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(**obj_in_data, uploaded_by=owner_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_multi_by_owner(
        self, db: Session, *, owner_id: int, skip: int = 0, limit: int = 100
    ) -> List[Document]:
        return (
            db.query(self.model)
            .filter(Document.uploaded_by == owner_id)
            .order_by(Document.uploaded_date.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def update_status(
        self, db: Session, *, document_id: int, status: str
    ) -> Optional[Document]:
        db_obj = db.query(self.model).filter(self.model.id == document_id).first()
        if db_obj:
            db_obj.status = status
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
        return db_obj
    
    def count_by_status(
        self, db: Session, *, status: str
    ) -> int:
        return db.query(func.count(self.model.id)).filter(self.model.status == status).scalar() or 0
    
    def count_by_status_and_owner(
        self, db: Session, *, status: str, owner_id: int
    ) -> int:
        return (
            db.query(func.count(self.model.id))
            .filter(self.model.status == status, self.model.uploaded_by == owner_id)
            .scalar() or 0
        )
    
    def get_recent(
        self, db: Session, *, limit: int = 5
    ) -> List[Document]:
        return (
            db.query(self.model)
            .order_by(self.model.uploaded_date.desc())
            .limit(limit)
            .all()
        )
    
    def get_recent_by_owner(
        self, db: Session, *, owner_id: int, limit: int = 5
    ) -> List[Document]:
        return (
            db.query(self.model)
            .filter(self.model.uploaded_by == owner_id)
            .order_by(self.model.uploaded_date.desc())
            .limit(limit)
            .all()
        )


document = CRUDDocument(Document)