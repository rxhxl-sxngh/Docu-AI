from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base_class import Base


class Document(Base):
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    content_type = Column(String, nullable=False)
    uploaded_by = Column(Integer, ForeignKey("user.id"))
    uploaded_date = Column(DateTime(timezone=True), server_default=func.now())
    modified_date = Column(DateTime(timezone=True), onupdate=func.now())
    status = Column(String, default="pending")  # pending, processing, completed, failed
    file_path = Column(String, nullable=True)  # Path to the stored file
    file_size = Column(Integer, nullable=True)  # Size in bytes
    
    # Relationships
    user = relationship("User", back_populates="documents")
    results = relationship("ProcessingResult", back_populates="document")
    queue_items = relationship("Queue", back_populates="document")