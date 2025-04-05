from typing import List, Optional

from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

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


document = CRUDDocument(Document)