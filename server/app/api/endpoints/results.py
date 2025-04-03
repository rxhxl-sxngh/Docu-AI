from typing import Any, List
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.get("/", response_model=List[schemas.Result])
def read_results(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve processing results.
    """
    if crud.user.is_superuser(current_user):
        results = crud.result.get_multi(db, skip=skip, limit=limit)
    else:
        # Only get results for documents uploaded by the current user
        results = crud.result.get_multi_by_owner(
            db=db, owner_id=current_user.id, skip=skip, limit=limit
        )
    return results


@router.get("/{id}", response_model=schemas.Result)
def read_result(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get result by ID.
    """
    result = crud.result.get(db=db, id=id)
    if not result:
        raise HTTPException(status_code=404, detail="Result not found")
    
    document = crud.document.get(db=db, id=result.document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if not crud.user.is_superuser(current_user) and document.uploaded_by != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    
    return result


@router.get("/document/{document_id}", response_model=schemas.Result)
def read_result_by_document(
    *,
    db: Session = Depends(deps.get_db),
    document_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get result by document ID.
    """
    document = crud.document.get(db=db, id=document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if not crud.user.is_superuser(current_user) and document.uploaded_by != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    
    result = crud.result.get_by_document(db=db, document_id=document_id)
    if not result:
        raise HTTPException(status_code=404, detail="Result not found for this document")
    
    return result


@router.put("/{id}/validate", response_model=schemas.Result)
def validate_result(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    status: str,
    notes: str = None,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Validate a processing result.
    """
    result = crud.result.get(db=db, id=id)
    if not result:
        raise HTTPException(status_code=404, detail="Result not found")
    
    document = crud.document.get(db=db, id=result.document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if not crud.user.is_superuser(current_user) and document.uploaded_by != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    
    if status not in ["validated", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status value")
    
    result = crud.result.validate_result(
        db=db, 
        result_id=id, 
        validator_id=current_user.id, 
        status=status, 
        notes=notes
    )
    
    return result


@router.put("/{id}", response_model=schemas.Result)
def update_result(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    result_in: schemas.ResultUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update a result.
    """
    result = crud.result.get(db=db, id=id)
    if not result:
        raise HTTPException(status_code=404, detail="Result not found")
    
    document = crud.document.get(db=db, id=result.document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if not crud.user.is_superuser(current_user) and document.uploaded_by != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    
    result = crud.result.update(db=db, db_obj=result, obj_in=result_in)
    return result