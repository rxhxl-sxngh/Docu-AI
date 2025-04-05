from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base_class import Base


class ProcessingResult(Base):
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("document.id"))
    created_date = Column(DateTime(timezone=True), server_default=func.now())
    modified_date = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Invoice specific fields
    invoice_number = Column(String, nullable=True)
    vendor_name = Column(String, nullable=True)
    invoice_date = Column(DateTime, nullable=True)
    due_date = Column(DateTime, nullable=True)
    total_amount = Column(Float, nullable=True)
    
    # Processing metadata
    confidence_score = Column(Float, default=0.0)
    processing_time = Column(Float, nullable=True)  # in seconds
    raw_extraction_data = Column(JSON, nullable=True)  # Store the raw extraction data
    
    # Status and validation
    status = Column(String, default="pending_validation")  # pending_validation, validated, rejected
    validation_notes = Column(String, nullable=True)
    validated_by = Column(Integer, ForeignKey("user.id"), nullable=True)
    validated_date = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    document = relationship("Document", back_populates="results")
    validator = relationship("User", back_populates="validations")