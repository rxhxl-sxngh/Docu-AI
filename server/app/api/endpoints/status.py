# server/app/api/endpoints/status.py
from typing import Any, Dict, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

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

@router.get("/processing_metrics", response_model=Dict[str, Any])
def get_processing_metrics(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get detailed processing metrics for visualization.
    Returns average time spent in each processing stage and overall metrics.
    """
    # Different results for admin vs regular users
    if crud.user.is_superuser(current_user):
        # Admin sees all results
        results = db.query(models.ProcessingResult).all()
    else:
        # Regular user only sees their results
        results = db.query(models.ProcessingResult).join(
            models.Document,
            models.ProcessingResult.document_id == models.Document.id
        ).filter(models.Document.uploaded_by == current_user.id).all()
    
    # Initialize metrics storage
    metrics = {
        "processing_time": {
            "ocr_time": 0,  # Text recognition time
            "nlp_extraction_time": 0,  # NLP entity extraction time
            "db_operation_time": 0,  # Database operations time
            "total_time": 0
        },
        "accuracy": {
            "avg_confidence": 0,
            "confidence_by_document_type": {} # For future use
        },
        "historical_data": get_historical_processing_data(db, current_user),
        "error_distribution": get_error_distribution(db, current_user)
    }
    
    if not results:
        return metrics
    
    # Calculate averages for time metrics
    ocr_times = [r.ocr_time for r in results if r.ocr_time is not None]
    nlp_extraction_times = [r.nlp_extraction_time for r in results if r.nlp_extraction_time is not None]
    db_operation_times = [r.db_operation_time for r in results if r.db_operation_time is not None]
    total_times = [r.processing_time for r in results if r.processing_time is not None]
    
    confidence_scores = [r.confidence_score for r in results if r.confidence_score is not None]
    
    # Calculate averages (safely handle empty lists)
    metrics["processing_time"]["ocr_time"] = safe_average(ocr_times)
    metrics["processing_time"]["nlp_extraction_time"] = safe_average(nlp_extraction_times)
    metrics["processing_time"]["db_operation_time"] = safe_average(db_operation_times)
    metrics["processing_time"]["total_time"] = safe_average(total_times)
    
    metrics["accuracy"]["avg_confidence"] = safe_average(confidence_scores)
    
    return metrics

def safe_average(values):
    """Calculate average safely, handling empty lists"""
    if not values:
        return 0
    return sum(values) / len(values)

def get_historical_processing_data(db, current_user):
    """Get historical processing data for the last 7 days"""
    from datetime import datetime, timedelta
    
    # Get today's date and the date 7 days ago
    end_date = datetime.now()
    start_date = end_date - timedelta(days=7)
    
    # Query to get counts by day
    query = db.query(
        func.date_trunc('day', models.ProcessingResult.created_date).label('day'),
        func.count().label('count')
    )
    
    # Filter by user if not superuser
    if not crud.user.is_superuser(current_user):
        query = query.join(
            models.Document,
            models.ProcessingResult.document_id == models.Document.id
        ).filter(models.Document.uploaded_by == current_user.id)
    
    # Complete the query with grouping and date filtering
    results = query.filter(
        models.ProcessingResult.created_date >= start_date,
        models.ProcessingResult.created_date <= end_date
    ).group_by(func.date_trunc('day', models.ProcessingResult.created_date)).all()
    
    # Transform results into the expected format
    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    historical_data = []
    
    # Initialize with zeros
    day_counts = {day: 0 for day in days}
    
    # Fill in actual values
    for day, count in results:
        day_name = days[day.weekday()]
        day_counts[day_name] = count
    
    # Convert to list format
    for day in days:
        historical_data.append({"name": day, "volume": day_counts[day]})
    
    return historical_data

def get_error_distribution(db, current_user):
    """Get error distribution data"""
    # In a real application, you would analyze error types
    # For now, return sample data
    return {
        "format_errors": 0.5,
        "ocr_issues": 0.4,
        "classification_errors": 0.2,
        "other": 0.1
    }