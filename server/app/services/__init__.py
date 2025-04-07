# server/app/services/__init__.py
from app.services.ocr_service import ocr_service
from app.services.ai_service import ai_service
from app.services.processing_service import process_document_task

# For clean imports
__all__ = ["ocr_service", "ai_service", "process_document_task"]