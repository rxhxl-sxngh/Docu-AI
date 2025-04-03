from typing import List, Optional

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.result import ProcessingResult
from app.schemas.result import ResultCreate, ResultUpdate


class CRUDResult(CRUDBase[ProcessingResult, ResultCreate, ResultUpdate]):
    def get_by_document_id(self, db: Session, *, document_id: int) -> Optional[ProcessingResult]:
        return db.query(ProcessingResult).filter(ProcessingResult.document_id == document_id).first()
    
    def get_multi_by_status(
        self, db: Session, *, status: str, skip: int = 0, limit: int = 100
    ) -> List[ProcessingResult]:
        return (
            db.query(self.model)
            .filter(ProcessingResult.status == status)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def create_with_document(
        self, db: Session, *, obj_in: ResultCreate, document_id: int
    ) -> ProcessingResult:
        obj_in_data = obj_in.dict()
        db_obj = self.model(**obj_in_data, document_id=document_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


result = CRUDResult(ProcessingResult)