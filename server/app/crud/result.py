# server/app/crud/result.py
from typing import List, Optional
from datetime import datetime

from sqlalchemy.orm import Session
from sqlalchemy import func

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
            .filter(self.model.document.has(uploaded_by=owner_id))
            .order_by(self.model.created_date.desc())
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
            .order_by(self.model.created_date.desc())
            .first()
        )
    
    def get_avg_confidence(
        self, db: Session
    ) -> float:
        result = db.query(func.avg(self.model.confidence_score)).scalar()
        return float(result) if result else 0.0
    
    def get_avg_processing_time(
        self, db: Session
    ) -> float:
        result = db.query(func.avg(self.model.processing_time)).scalar()
        return float(result) if result else 0.0
    
    def get_avg_confidence_by_owner(
        self, db: Session, *, owner_id: int
    ) -> float:
        result = (
            db.query(func.avg(self.model.confidence_score))
            .join(self.model.document)
            .filter(self.model.document.has(uploaded_by=owner_id))
            .scalar()
        )
        return float(result) if result else 0.0
    
    def get_avg_processing_time_by_owner(
        self, db: Session, *, owner_id: int
    ) -> float:
        result = (
            db.query(func.avg(self.model.processing_time))
            .join(self.model.document)
            .filter(self.model.document.has(uploaded_by=owner_id))
            .scalar()
        )
        return float(result) if result else 0.0
    
    def get_recent(
        self, db: Session, *, limit: int = 5
    ) -> List[ProcessingResult]:
        return (
            db.query(self.model)
            .order_by(self.model.created_date.desc())
            .limit(limit)
            .all()
        )
    
    def get_recent_by_owner(
        self, db: Session, *, owner_id: int, limit: int = 5
    ) -> List[ProcessingResult]:
        return (
            db.query(self.model)
            .join(self.model.document)
            .filter(self.model.document.has(uploaded_by=owner_id))
            .order_by(self.model.created_date.desc())
            .limit(limit)
            .all()
        )


result = CRUDResult(ProcessingResult)