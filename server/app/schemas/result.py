from typing import Optional, Dict, Any
from datetime import datetime

from pydantic import BaseModel


# Shared properties
class ResultBase(BaseModel):
    document_id: int
    invoice_number: Optional[str] = None
    vendor_name: Optional[str] = None
    invoice_date: Optional[datetime] = None
    due_date: Optional[datetime] = None
    total_amount: Optional[float] = None
    confidence_score: float = 0.0
    processing_time: Optional[float] = None
    
    # Detailed processing time fields
    ocr_time: Optional[float] = None  # Time spent on text recognition
    nlp_extraction_time: Optional[float] = None  # Time spent on NLP entity extraction
    db_operation_time: Optional[float] = None  # Time spent on database operations
    
    status: str = "pending_validation"


# Properties to receive on result creation
class ResultCreate(ResultBase):
    raw_extraction_data: Optional[Dict[str, Any]] = None


# Properties to receive on result update
class ResultUpdate(BaseModel):
    invoice_number: Optional[str] = None
    vendor_name: Optional[str] = None
    invoice_date: Optional[datetime] = None
    due_date: Optional[datetime] = None
    total_amount: Optional[float] = None
    status: Optional[str] = None
    validation_notes: Optional[str] = None


# Properties shared by models stored in DB
class ResultInDBBase(ResultBase):
    id: int
    created_date: datetime
    modified_date: Optional[datetime] = None
    raw_extraction_data: Optional[Dict[str, Any]] = None
    validation_notes: Optional[str] = None
    validated_by: Optional[int] = None
    validated_date: Optional[datetime] = None

    class Config:
        from_attributes = True


# Properties to return to client
class Result(ResultInDBBase):
    pass


# Properties stored in DB
class ResultInDB(ResultInDBBase):
    pass