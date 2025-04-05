from typing import List, Optional
from datetime import datetime

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.result import ProcessingResult
from app.schemas.result import ResultCreate, ResultUpdate


class CRUDResult(CRUDBase[ProcessingResult, ResultCreate, ResultUpdate]):
    def get_multi_by_owner(
        self, db: Session, *, owner_id: int, skip: int = 0, limit: int = 100
    ) -> List[ProcessingResult]:
        return (
            db.query(self.model)
            .join(self.model.document)
            .filter(self.model.document.uploaded_by == owner_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def validate_result(
        self, db: Session, *, result_id: int, validator_id: int, status: str, notes: Optional[str] = None
    ) -> ProcessingResult:
        db_obj = db.query(self.model).filter(self.model.id == result_id).first()
        if db_obj:
            db_obj.status = status
            db_obj.validated_by = validator_id
            db_obj.validated_date = datetime.now()
            if notes:
                db_obj.validation_notes = notes
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
        return db_obj
    
    def get_by_document(
        self, db: Session, *, document_id: int
    ) -> Optional[ProcessingResult]:
        return (
            db.query(self.model)
            .filter(self.model.document_id == document_id)
            .first()
        )


result = CRUDResult(ProcessingResult)