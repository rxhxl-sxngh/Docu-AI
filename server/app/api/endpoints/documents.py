import os
import shutil
from typing import Any, List
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
from app.core.config import settings

router = APIRouter()

# Define the upload directory
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/", response_model=schemas.Document)
async def upload_document(
    *,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Upload a new document and add it to the processing queue.
    """
    # Validate file type
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400, 
            detail="Only PDF files are supported"
        )
    
    # Create a unique filename to avoid collisions
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    unique_filename = f"{timestamp}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Save the file
    try:
        # First create the file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Get the file size
        file_size = os.path.getsize(file_path)
        
        # Create document in database
        document_in = schemas.DocumentCreate(
            filename=file.filename,
            content_type=file.content_type,
        )
        document = crud.document.create_with_owner(
            db=db, obj_in=document_in, owner_id=current_user.id
        )
        
        # Update file path and size
        document = crud.document.update(
            db=db,
            db_obj=document,
            obj_in={"file_path": file_path, "file_size": file_size}
        )
        
        # Add to processing queue
        queue_in = schemas.QueueCreate(
            document_id=document.id,
            status="pending",
            priority=1  # Default priority
        )
        crud.queue.create(db=db, obj_in=queue_in)
        
        # Start processing in the background
        # (This would typically call your processing task)
        # background_tasks.add_task(process_document, document.id)
        
        return document
        
    except Exception as e:
        # Clean up the file if an error occurs
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(
            status_code=500,
            detail=f"Error uploading document: {str(e)}"
        )


@router.get("/", response_model=List[schemas.Document])
def read_documents(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve documents.
    """
    if crud.user.is_superuser(current_user):
        documents = crud.document.get_multi(db, skip=skip, limit=limit)
    else:
        documents = crud.document.get_multi_by_owner(
            db=db, owner_id=current_user.id, skip=skip, limit=limit
        )
    return documents


@router.get("/{id}", response_model=schemas.Document)
def read_document(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get document by ID.
    """
    document = crud.document.get(db=db, id=id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if not crud.user.is_superuser(current_user) and document.uploaded_by != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    
    return document


@router.get("/{id}/download")
def download_document(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Download the original document.
    """
    document = crud.document.get(db=db, id=id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if not crud.user.is_superuser(current_user) and document.uploaded_by != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    
    if not document.file_path or not os.path.exists(document.file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(
        path=document.file_path,
        filename=document.filename,
        media_type=document.content_type
    )


@router.delete("/{id}", response_model=schemas.Document)
def delete_document(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Delete a document.
    """
    document = crud.document.get(db=db, id=id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if not crud.user.is_superuser(current_user) and document.uploaded_by != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    
    # Delete the file if it exists
    if document.file_path and os.path.exists(document.file_path):
        os.remove(document.file_path)
    
    document = crud.document.remove(db=db, id=id)
    return document


@router.put("/{id}", response_model=schemas.Document)
def update_document(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    document_in: schemas.DocumentUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update a document's metadata.
    """
    document = crud.document.get(db=db, id=id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if not crud.user.is_superuser(current_user) and document.uploaded_by != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    
    document = crud.document.update(db=db, db_obj=document, obj_in=document_in)
    return document


@router.post("/{id}/reprocess", response_model=schemas.Document)
def reprocess_document(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    priority: int = 1,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Reprocess a document (add it to the queue again).
    """
    document = crud.document.get(db=db, id=id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if not crud.user.is_superuser(current_user) and document.uploaded_by != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    
    # Update document status
    document = crud.document.update_status(db=db, document_id=id, status="pending")
    
    # Add to processing queue
    queue_in = schemas.QueueCreate(
        document_id=document.id,
        status="pending",
        priority=priority
    )
    crud.queue.create(db=db, obj_in=queue_in)
    
    return document