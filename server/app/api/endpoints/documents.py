from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.post("/", response_model=schemas.Document)
def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Upload a new document.
    """
    document_in = schemas.DocumentCreate(
        filename=file.filename,
        content_type=file.content_type,
    )
    document = crud.document.create_with_owner(
        db=db, obj_in=document_in, owner_id=current_user.id
    )
    
    # Handle file storage (could save to disk or a service like S3)
    # Then trigger OCR processing as a background task
    
    return document


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