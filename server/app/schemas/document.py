from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# Shared properties
class DocumentBase(BaseModel):
    filename: str
    content_type: str
    status: Optional[str] = "pending"


# Properties to receive on document creation
class DocumentCreate(DocumentBase):
    pass


# Properties to receive on document update
class DocumentUpdate(BaseModel):
    status: Optional[str] = None


# Properties shared by models stored in DB
class DocumentInDBBase(DocumentBase):
    id: int
    uploaded_by: int
    uploaded_date: datetime
    modified_date: Optional[datetime] = None

    class Config:
        orm_mode = True


# Properties to return to client
class Document(DocumentInDBBase):
    pass


# Properties stored in DB
class DocumentInDB(DocumentInDBBase):
    pass