# server/app/api/endpoints/queue.py
from typing import Any, List
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
from app.services.processing_service import process_document_task

router = APIRouter()


@router.post("/", response_model=schemas.Queue)
def create_queue_item(
    *,
    db: Session = Depends(deps.get_db),
    item_in: schemas.QueueCreate,
    background_tasks: BackgroundTasks,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new queue item and start processing.
    """
    document = crud.document.get(db=db, id=item_in.document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Check if document belongs to user or user is admin
    if not crud.user.is_superuser(current_user) and document.uploaded_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    # Create queue item
    queue_item = crud.queue.create(db=db, obj_in=item_in)
    
    # Start background processing task
    background_tasks.add_task(
        process_document_task,
        document_id=document.id,
        queue_id=queue_item.id
    )
    
    return queue_item


@router.get("/", response_model=List[schemas.Queue])
def read_queue_items(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve queue items.
    """
    if crud.user.is_superuser(current_user):
        queue_items = crud.queue.get_multi(db, skip=skip, limit=limit)
    else:
        # Only get queue items for documents uploaded by the current user
        queue_items = crud.queue.get_multi_by_owner(
            db=db, owner_id=current_user.id, skip=skip, limit=limit
        )
    return queue_items


@router.get("/{id}", response_model=schemas.Queue)
def read_queue_item(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get queue item by ID.
    """
    queue_item = crud.queue.get(db=db, id=id)
    if not queue_item:
        raise HTTPException(status_code=404, detail="Queue item not found")
    
    document = crud.document.get(db=db, id=queue_item.document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if not crud.user.is_superuser(current_user) and document.uploaded_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return queue_item


@router.post("/{id}/reprocess", response_model=schemas.Queue)
def reprocess_queue_item(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    background_tasks: BackgroundTasks,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Reprocess a queue item.
    """
    queue_item = crud.queue.get(db=db, id=id)
    if not queue_item:
        raise HTTPException(status_code=404, detail="Queue item not found")
    
    document = crud.document.get(db=db, id=queue_item.document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if not crud.user.is_superuser(current_user) and document.uploaded_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    # Reset queue item status
    queue_item = crud.queue.update_status(db, queue_id=id, status="pending")
    
    # Reset document status
    document = crud.document.update_status(db, document_id=document.id, status="pending")
    
    # Start background processing task
    background_tasks.add_task(
        process_document_task,
        document_id=document.id,
        queue_id=queue_item.id
    )
    
    return queue_item


@router.put("/{id}", response_model=schemas.Queue)
def update_queue_item(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    item_in: schemas.QueueUpdate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Update a queue item. Only superusers can update queue items.
    """
    queue_item = crud.queue.get(db=db, id=id)
    if not queue_item:
        raise HTTPException(status_code=404, detail="Queue item not found")
    
    queue_item = crud.queue.update(db=db, db_obj=queue_item, obj_in=item_in)
    return queue_item


@router.delete("/{id}", response_model=schemas.Queue)
def delete_queue_item(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Delete a queue item. Only superusers can delete queue items.
    """
    queue_item = crud.queue.get(db=db, id=id)
    if not queue_item:
        raise HTTPException(status_code=404, detail="Queue item not found")
    
    queue_item = crud.queue.remove(db=db, id=id)
    return queue_item