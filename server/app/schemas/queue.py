from typing import Optional
from datetime import datetime

from pydantic import BaseModel


# Shared properties
class QueueBase(BaseModel):
    document_id: int
    status: str = "pending"
    priority: int = 1


# Properties to receive on queue item creation
class QueueCreate(QueueBase):
    pass


# Properties to receive on queue item update
class QueueUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[int] = None
    error_message: Optional[str] = None


# Properties shared by models stored in DB
class QueueInDBBase(QueueBase):
    id: int
    created_date: datetime
    modified_date: Optional[datetime] = None
    process_start_time: Optional[datetime] = None
    process_end_time: Optional[datetime] = None
    error_message: Optional[str] = None

    class Config:
        orm_mode = True


# Properties to return to client
class Queue(QueueInDBBase):
    pass


# Properties stored in DB
class QueueInDB(QueueInDBBase):
    pass