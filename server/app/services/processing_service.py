import logging
from datetime import datetime
from typing import Optional
import time

from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.db.session import SessionLocal
from app.services.ocr_service import ocr_service
from app.services.ai_service import ai_service

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def process_document_task(document_id: int, queue_id: int) -> None:
    """
    Background task to process document using OCR and AI extraction
    with detailed timing for each stage
    """
    # Create a new database session
    db = SessionLocal()
    
    # Initialize timing variables
    ocr_time = 0.0
    nlp_extraction_time = 0.0
    db_operation_time = 0.0
    
    try:
        # Track database time
        db_start = time.time()
        # Update queue status to processing
        queue_item = crud.queue.update_status(db, queue_id=queue_id, status="processing")
        logger.info(f"Processing started for document {document_id}, queue item {queue_id}")
        
        # Update document status
        document = crud.document.update_status(db, document_id=document_id, status="processing")
        
        # Update process start time
        queue_item = crud.queue.update_process_start_time(db, queue_id=queue_id)
        db_end = time.time()
        db_operation_time += (db_end - db_start)
        
        # Process document
        try:
            # Get document path
            db_start = time.time()
            document = crud.document.get(db, id=document_id)
            db_end = time.time()
            db_operation_time += (db_end - db_start)
            
            if not document or not document.file_path:
                raise ValueError(f"Document {document_id} not found or file path is missing")
            
            start_time = time.time()
            
            # Process document with OCR
            logger.info(f"Starting OCR processing for document {document_id}")
            ocr_start = time.time()
            ocr_result = ocr_service.process_document(document.file_path)
            ocr_end = time.time()
            ocr_time = ocr_end - ocr_start
            logger.info(f"OCR completed in {ocr_time:.2f} seconds")
            
            # Process with AI service for NLP extraction
            logger.info(f"Starting NLP entity extraction for document {document_id}")
            extraction_start = time.time()
            ai_result = ai_service.process_document(document.file_path)
            extraction_end = time.time()
            nlp_extraction_time = extraction_end - extraction_start
            logger.info(f"NLP extraction completed in {nlp_extraction_time:.2f} seconds")
            
            end_time = time.time()
            
            # Calculate total processing time
            total_processing_time = (end_time - start_time)
            logger.info(f"Document {document_id} processed in {total_processing_time:.2f} seconds")
            
            # Extract data from AI result
            extracted_data = ai_result.get("extracted_data", {})
            confidence_score = ai_result.get("confidence_score", 0.0)
            
            # Parse dates if they exist
            invoice_date = parse_date(extracted_data.get("invoice_date"))
            due_date = parse_date(extracted_data.get("due_date"))
            
            # Database storage stage
            db_start = time.time()
            
            # Create result in database with detailed timing information
            result_in = schemas.ResultCreate(
                document_id=document_id,
                invoice_number=extracted_data.get("invoice_number"),
                vendor_name=extracted_data.get("vendor_name"),
                invoice_date=invoice_date,
                due_date=due_date,
                total_amount=extracted_data.get("total_amount"),
                confidence_score=confidence_score,
                processing_time=total_processing_time,
                ocr_time=ocr_time,
                nlp_extraction_time=nlp_extraction_time,
                db_operation_time=db_operation_time,  # This will be updated below
                raw_extraction_data={
                    "ocr_result": ocr_result,
                    "ai_result": ai_result
                },
                status="pending_validation"
            )
            
            result = crud.result.create(db, obj_in=result_in)
            logger.info(f"Created result record {result.id} for document {document_id}")
            
            # Update queue status to completed
            queue_item = crud.queue.update_status(db, queue_id=queue_id, status="completed")
            
            # Update document status to processed
            document = crud.document.update_status(db, document_id=document_id, status="processed")
            
            # Update process end time
            queue_item = crud.queue.update_process_end_time(db, queue_id=queue_id)
            
            db_end = time.time()
            db_time = db_end - db_start + db_operation_time
            
            # Update the db_operation_time field after creation
            db.query(models.ProcessingResult).filter(models.ProcessingResult.id == result.id).update(
                {"db_operation_time": db_time}
            )
            db.commit()
            
            logger.info(f"Document {document_id} processing completed successfully")
            
        except Exception as e:
            # Update queue status on error
            error_message = str(e)
            logger.error(f"Error processing document {document_id}: {error_message}")
            
            queue_item = crud.queue.update_status(
                db, queue_id=queue_id, status="failed", error_message=error_message
            )
            
            # Update document status
            document = crud.document.update_status(db, document_id=document_id, status="failed")
            
    finally:
        db.close()


def parse_date(date_str: Optional[str]) -> Optional[datetime]:
    """
    Parse date string to datetime object.
    Supports common date formats.
    """
    if not date_str:
        return None

    # Try common date formats
    formats = [
        "%m/%d/%Y", "%d/%m/%Y", "%Y-%m-%d", 
        "%m-%d-%Y", "%d-%m-%Y", "%m/%d/%y", 
        "%d/%m/%y", "%Y/%m/%d"
    ]
    
    for date_format in formats:
        try:
            return datetime.strptime(date_str, date_format)
        except ValueError:
            continue
            
    logger.warning(f"Could not parse date string: {date_str}")
    return None