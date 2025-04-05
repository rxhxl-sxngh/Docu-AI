from typing import Dict, List, Any, Optional
import json
import re
from datetime import datetime

from app.services.ocr_service import ocr_service


class AIService:
    """
    Service for AI-based document processing and data extraction.
    """
    
    def __init__(self):
        self.ocr_service = ocr_service
    
    def process_document(self, file_path: str) -> Dict[str, Any]:
        """
        Process a document and extract relevant information.
        
        Args:
            file_path: Path to the document file
            
        Returns:
            Dict containing extracted data and processing metadata
        """
        # Process with OCR
        ocr_result = self.ocr_service.process_document(file_path)
        
        # Extract structured data
        extracted_data = self._extract_invoice_data(ocr_result)
        
        # Calculate confidence score
        confidence_score = self._calculate_confidence(extracted_data)
        
        return {
            "extracted_data": extracted_data,
            "confidence_score": confidence_score,
            "raw_ocr_result": ocr_result
        }
    
    def _extract_invoice_data(self, ocr_result: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Extract structured invoice data from OCR results.
        
        Args:
            ocr_result: Raw OCR results
            
        Returns:
            Dict containing structured invoice data
        """
        text_blocks = [item["text"] for item in ocr_result]
        full_text = " ".join(text_blocks)
        
        # Initialize extracted data with None values
        extracted_data = {
            "invoice_number": None,
            "vendor_name": None,
            "invoice_date": None,
            "due_date": None,
            "total_amount": None,
            "line_items": []
        }
        
        # Extract invoice number
        invoice_number_patterns = [
            r"invoice\s*#?\s*(\w+[-/]?\w+)",
            r"invoice\s*number\s*:?\s*(\w+[-/]?\w+)",
            r"inv\s*#?\s*(\w+[-/]?\w+)"
        ]
        for pattern in invoice_number_patterns:
            match = re.search(pattern, full_text, re.IGNORECASE)
            if match:
                extracted_data["invoice_number"] = match.group(1).strip()
                break
        
        # Extract vendor name
        # This is a simplified approach - in a real system, you'd use NER or other techniques
        vendor_name_patterns = [
            r"from:\s*([A-Za-z0-9\s,.]+)",
            r"vendor:\s*([A-Za-z0-9\s,.]+)",
            r"supplier:\s*([A-Za-z0-9\s,.]+)"
        ]
        for pattern in vendor_name_patterns:
            match = re.search(pattern, full_text, re.IGNORECASE)
            if match:
                extracted_data["vendor_name"] = match.group(1).strip()
                break
        
        # Extract invoice date
        date_patterns = [
            r"invoice\s*date\s*:?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})",
            r"date\s*:?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})",
            r"issued\s*:?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})"
        ]
        for pattern in date_patterns:
            match = re.search(pattern, full_text, re.IGNORECASE)
            if match:
                extracted_data["invoice_date"] = match.group(1).strip()
                break
        
        # Extract due date
        due_date_patterns = [
            r"due\s*date\s*:?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})",
            r"payment\s*due\s*:?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})",
            r"due\s*by\s*:?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})"
        ]
        for pattern in due_date_patterns:
            match = re.search(pattern, full_text, re.IGNORECASE)
            if match:
                extracted_data["due_date"] = match.group(1).strip()
                break
        
        # Extract total amount
        amount_patterns = [
            r"total\s*:?\s*\$?\s*(\d{1,3}(?:,\d{3})*\.\d{2})",
            r"amount\s*due\s*:?\s*\$?\s*(\d{1,3}(?:,\d{3})*\.\d{2})",
            r"total\s*amount\s*:?\s*\$?\s*(\d{1,3}(?:,\d{3})*\.\d{2})"
        ]
        for pattern in amount_patterns:
            match = re.search(pattern, full_text, re.IGNORECASE)
            if match:
                amount_str = match.group(1).strip()
                # Remove commas and convert to float
                amount_str = amount_str.replace(',', '')
                extracted_data["total_amount"] = float(amount_str)
                break
        
        # In a real system, you'd also extract line items and other details
        
        return extracted_data
    
    def _calculate_confidence(self, extracted_data: Dict[str, Any]) -> float:
        """
        Calculate confidence score for the extracted data.
        
        Args:
            extracted_data: The extracted structured data
            
        Returns:
            Confidence score between 0 and 1
        """
        # Count the number of fields that are not None
        non_none_fields = sum(1 for value in extracted_data.values() if value is not None)
        
        # Get the total number of fields (excluding line_items which is a list)
        total_fields = len(extracted_data) - 1  # Subtract 1 for line_items
        
        # Calculate confidence as ratio of non-None fields to total fields
        confidence = non_none_fields / total_fields if total_fields > 0 else 0
        
        return confidence


ai_service = AIService()