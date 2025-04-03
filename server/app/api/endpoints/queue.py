from typing import Any, List
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
from app.services.ocr_service import ocr_service

router = APIRouter()


async def process_document(
    document_id: int,
    queue_id: int,
    db: Session
):
    """
    Background task to process document using OCR
    """
    # Update queue status to processing
    queue_item = crud.queue.update_status(db, queue_id=queue_id, status="processing")
    
    # Update document status
    document = crud.document.update_status(db, document_id=document_id, status="processing")
    
    # Update process start time
    queue_item = crud.queue.update_process_start_time(db, queue_id=queue_id)
    
    try:
        # Get document path
        document_path = f"uploads/{document.filename}"  # Adjust based on your storage
        
        # Process document with OCR
        start_time = datetime.now()
        ocr_result = ocr_service.process_document(document_path)
        end_time = datetime.now()
        
        # Calculate processing time
        processing_time = (end_time - start_time).total_seconds()
        
        # Extract invoice data (this is a simplified version)
        invoice_number = None
        vendor_name = None
        invoice_date = None
        due_date = None
        total_amount = None
        confidence_score = 0.0
        
        # In a real implementation, you'd process the OCR results to extract the data
        
        # Create result
        result_in = schemas.ResultCreate(
            document_id=document_id,
            invoice_number=invoice_number,
            vendor_name=vendor_name,
            invoice_date=invoice_date,
            due_date=due_date,
            total_amount=total_amount,
            confidence_score=confidence_score,
            processing_time=processing_time,
            raw_extraction_data=ocr_result,
        )
        
        result = crud.result.create(db, obj_in=result_in)
        
        # Update queue status
        queue_item = crud.queue.update_status(db, queue_id=queue_id, status="completed")
        
        # Update document status
        document = crud.document.update_status(db, document_id=document_id, status="processed")
        
        # Update process end time
        queue_item = crud.queue.update_process_end_time(db, queue_id=queue_id)
        
    except Exception as e:
        # Update queue status on error
        error_message = str(e)
        queue_item = crud.queue.update_status(db, queue_id=queue_id, status="failed", error_message=error_message)
        
        # Update document status
        document = crud.document.update_status(db, document_id=document_id, status="failed")


@router.post("/", response_model=schemas.Queue)
def create_queue_item(
    *,
    db: Session = Depends(deps.get_db),
    item_in: schemas.QueueCreate,
    background_tasks: BackgroundTasks,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new queue item.
    """
    document = crud.document.get(db=db, id=item_in.document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    queue_item = crud.queue.create(db=db, obj_in=item_in)
    
    # Start background processing task
    background_tasks.add_task(
        process_document,
        document_id=document.id,
        queue_id=queue_item.id,
        db=db
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
        raise HTTPException(status_code=400, detail="Not enough permissions")
    
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