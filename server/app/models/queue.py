from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base_class import Base


class Queue(Base):
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("document.id"))
    status = Column(String, default="pending")  # pending, processing, completed, failed
    priority = Column(Integer, default=1)  # 1-5 priority levels
    created_date = Column(DateTime(timezone=True), server_default=func.now())
    modified_date = Column(DateTime(timezone=True), onupdate=func.now())
    process_start_time = Column(DateTime(timezone=True), nullable=True)
    process_end_time = Column(DateTime(timezone=True), nullable=True)
    error_message = Column(String, nullable=True)
    
    # Relationships
    document = relationship("Document", back_populates="queue_items")