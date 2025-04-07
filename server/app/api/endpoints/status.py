# server/app/api/endpoints/status.py
from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models
from app.api import deps

router = APIRouter()


@router.get("/document/{document_id}", response_model=Dict[str, Any])
def get_document_status(
    *,
    db: Session = Depends(deps.get_db),
    document_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get processing status for a document.
    Returns status info from document, queue, and result records.
    """
    # Get the document
    document = crud.document.get(db=db, id=document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Check permissions
    if not crud.user.is_superuser(current_user) and document.uploaded_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    # Get latest queue item for the document
    queue_items = crud.queue.get_by_document(db=db, document_id=document_id)
    latest_queue = queue_items[0] if queue_items else None
    
    # Get processing result if available
    result = crud.result.get_by_document(db=db, document_id=document_id)
    
    # Build status response
    status_info = {
        "document_id": document.id,
        "filename": document.filename,
        "status": document.status,
        "upload_date": document.uploaded_date,
        "queue_status": None,
        "process_start": None,
        "process_end": None,
        "processing_time": None,
        "error_message": None,
        "result_status": None,
        "confidence_score": None,
        "extracted_fields": {}
    }
    
    # Add queue info if available
    if latest_queue:
        status_info.update({
            "queue_id": latest_queue.id,
            "queue_status": latest_queue.status,
            "process_start": latest_queue.process_start_time,
            "process_end": latest_queue.process_end_time,
            "error_message": latest_queue.error_message
        })
    
    # Add result info if available
    if result:
        status_info.update({
            "result_id": result.id,
            "result_status": result.status,
            "confidence_score": result.confidence_score,
            "processing_time": result.processing_time,
            "extracted_fields": {
                "invoice_number": result.invoice_number,
                "vendor_name": result.vendor_name,
                "invoice_date": result.invoice_date,
                "due_date": result.due_date,
                "total_amount": result.total_amount
            }
        })
    
    return status_info


@router.get("/stats", response_model=Dict[str, Any])
def get_processing_stats(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get processing statistics.
    Shows counts of documents in different statuses and average processing metrics.
    """
    # Different stats for admin vs regular users
    if crud.user.is_superuser(current_user):
        # Admin sees all documents
        pending_count = crud.document.count_by_status(db, status="pending")
        processing_count = crud.document.count_by_status(db, status="processing")
        processed_count = crud.document.count_by_status(db, status="processed")
        failed_count = crud.document.count_by_status(db, status="failed")
        
        # Get queue stats
        queue_pending = crud.queue.count_by_status(db, status="pending")
        queue_processing = crud.queue.count_by_status(db, status="processing")
        queue_completed = crud.queue.count_by_status(db, status="completed")
        queue_failed = crud.queue.count_by_status(db, status="failed")
        
        # Get average processing metrics
        avg_confidence = crud.result.get_avg_confidence(db)
        avg_processing_time = crud.result.get_avg_processing_time(db)
        
        # Get recent activity
        recent_documents = crud.document.get_recent(db, limit=5)
        recent_results = crud.result.get_recent(db, limit=5)
    else:
        # Regular user only sees their documents
        pending_count = crud.document.count_by_status_and_owner(
            db, status="pending", owner_id=current_user.id
        )
        processing_count = crud.document.count_by_status_and_owner(
            db, status="processing", owner_id=current_user.id
        )
        processed_count = crud.document.count_by_status_and_owner(
            db, status="processed", owner_id=current_user.id
        )
        failed_count = crud.document.count_by_status_and_owner(
            db, status="failed", owner_id=current_user.id
        )
        
        # Get queue stats for user's documents
        queue_pending = crud.queue.count_by_status_and_owner(
            db, status="pending", owner_id=current_user.id
        )
        queue_processing = crud.queue.count_by_status_and_owner(
            db, status="processing", owner_id=current_user.id
        )
        queue_completed = crud.queue.count_by_status_and_owner(
            db, status="completed", owner_id=current_user.id
        )
        queue_failed = crud.queue.count_by_status_and_owner(
            db, status="failed", owner_id=current_user.id
        )
        
        # Get average processing metrics for user's documents
        avg_confidence = crud.result.get_avg_confidence_by_owner(db, owner_id=current_user.id)
        avg_processing_time = crud.result.get_avg_processing_time_by_owner(db, owner_id=current_user.id)
        
        # Get recent activity for user
        recent_documents = crud.document.get_recent_by_owner(db, owner_id=current_user.id, limit=5)
        recent_results = crud.result.get_recent_by_owner(db, owner_id=current_user.id, limit=5)
    
    return {
        "document_counts": {
            "pending": pending_count,
            "processing": processing_count,
            "processed": processed_count,
            "failed": failed_count,
            "total": pending_count + processing_count + processed_count + failed_count
        },
        "queue_counts": {
            "pending": queue_pending,
            "processing": queue_processing,
            "completed": queue_completed,
            "failed": queue_failed,
            "total": queue_pending + queue_processing + queue_completed + queue_failed
        },
        "processing_metrics": {
            "avg_confidence": avg_confidence,
            "avg_processing_time": avg_processing_time
        },
        "recent_activity": {
            "documents": [doc.filename for doc in recent_documents],
            "results": [
                {
                    "document_id": res.document_id,
                    "status": res.status,
                    "confidence": res.confidence_score
                }
                for res in recent_results
            ]
        }
    }