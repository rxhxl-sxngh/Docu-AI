# server/app/services/ai_service.py
import logging
from typing import Dict, List, Any, Optional
import re
import time
from datetime import datetime

from app.services.ocr_service import ocr_service

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


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
        logger.info(f"Starting OCR processing for file: {file_path}")
        ocr_result = self.ocr_service.process_document(file_path)
        logger.info(f"OCR processing completed with {len(ocr_result)} text blocks")
        
        # Extract structured data
        logger.info("Extracting structured data from OCR results")
        extracted_data = self._extract_invoice_data(ocr_result)
        
        # Calculate confidence score
        confidence_score = self._calculate_confidence(extracted_data)
        logger.info(f"Extraction completed with confidence score: {confidence_score:.2f}")
        
        # Log extracted fields
        for key, value in extracted_data.items():
            if key != "line_items":  # Skip logging large arrays
                logger.info(f"Extracted {key}: {value}")
        
        return {
            "extracted_data": extracted_data,
            "confidence_score": confidence_score,
            # "raw_ocr_result": ocr_result
        }
    
    def _extract_invoice_data(self, ocr_result: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Extract structured invoice data from OCR results.
        
        Args:
            ocr_result: Raw OCR results
            
        Returns:
            Dict containing structured invoice data
        """
        # Collect all text from OCR result
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
            r"inv\s*#?\s*(\w+[-/]?\w+)",
            r"invoice\s*no\.?\s*:?\s*(\w+[-/]?\w+)",
            r"\b(inv-\w+)\b"
        ]
        for pattern in invoice_number_patterns:
            match = re.search(pattern, full_text, re.IGNORECASE)
            if match:
                extracted_data["invoice_number"] = match.group(1).strip()
                break
        
        # Extract vendor name - improved approach with position analysis
        vendor_name_patterns = [
            r"from:\s*([A-Za-z0-9\s,.]+)",
            r"vendor:\s*([A-Za-z0-9\s,.]+)",
            r"supplier:\s*([A-Za-z0-9\s,.]+)",
            r"bill\s+from\s*:?\s*([A-Za-z0-9\s,.]+)"
        ]
        
        for pattern in vendor_name_patterns:
            match = re.search(pattern, full_text, re.IGNORECASE)
            if match:
                extracted_data["vendor_name"] = match.group(1).strip()
                break
        
        # Fallback vendor extraction - look for text at top of document
        if not extracted_data["vendor_name"]:
            # Sort blocks by vertical position (y-coordinate)
            sorted_blocks = sorted(ocr_result, key=lambda x: x.get("position", [[0, 0]])[0][1] if x.get("position") else 0)
            
            # Take the first few blocks (likely header/company name)
            top_blocks = sorted_blocks[:3]
            for block in top_blocks:
                text = block.get("text", "")
                # Avoid simple labels and look for business name patterns
                if len(text) > 5 and not re.match(r"^(invoice|statement|bill|receipt)$", text, re.IGNORECASE):
                    extracted_data["vendor_name"] = text.strip()
                    break
        
        # Extract dates with improved patterns
        date_patterns = [
            r"(?:invoice|document)\s*date\s*:?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})",
            r"date\s*:?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})",
            r"issued\s*:?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})",
            r"date\s*of\s*invoice\s*:?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})",
            r"\b(\d{1,2}[/-]\d{1,2}[/-]\d{4})\b"  # Generic date pattern as fallback
        ]
        
        for pattern in date_patterns:
            match = re.search(pattern, full_text, re.IGNORECASE)
            if match:
                extracted_data["invoice_date"] = match.group(1).strip()
                break
        
        # Extract due date with improved patterns
        due_date_patterns = [
            r"due\s*date\s*:?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})",
            r"payment\s*due\s*:?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})",
            r"due\s*by\s*:?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})",
            r"due\s*:?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})",
            r"pay\s*by\s*:?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})"
        ]
        
        for pattern in due_date_patterns:
            match = re.search(pattern, full_text, re.IGNORECASE)
            if match:
                extracted_data["due_date"] = match.group(1).strip()
                break
        
        # Extract total amount with improved patterns
        amount_patterns = [
            r"total\s*:?\s*\$?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)",
            r"amount\s*due\s*:?\s*\$?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)",
            r"total\s*amount\s*:?\s*\$?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)",
            r"balance\s*due\s*:?\s*\$?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)",
            r"total\s*due\s*:?\s*\$?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)",
            r"to\s*pay\s*:?\s*\$?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)",
            r"\$\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)"  # Generic amount pattern
        ]
        
        for pattern in amount_patterns:
            match = re.search(pattern, full_text, re.IGNORECASE)
            if match:
                amount_str = match.group(1).strip()
                # Remove commas and convert to float
                amount_str = amount_str.replace(',', '')
                try:
                    extracted_data["total_amount"] = float(amount_str)
                    break
                except ValueError:
                    continue
        
        # Extract line items (simplified approach)
        # This is a basic implementation that could be improved
        self._extract_line_items(ocr_result, extracted_data)

        time.sleep(1)
        
        return extracted_data
    
    def _extract_line_items(self, ocr_result: List[Dict[str, Any]], extracted_data: Dict[str, Any]) -> None:
        """
        Extract line items from the OCR result.
        This is a simplified implementation.
        """
        # TODO: Implement more sophisticated line item extraction
        # For now, we'll just look for patterns that might represent line items
        
        # Convert all text to a string for processing
        text_blocks = [item["text"] for item in ocr_result]
        full_text = " ".join(text_blocks)
        
        # Look for a table-like section with amounts
        lines = full_text.split('\n')
        potential_items = []
        
        for line in lines:
            # Look for lines that have a quantity, description and amount
            # This is a simplified pattern and would need refinement for real-world use
            if re.search(r'\d+\s+[A-Za-z0-9\s]+\s+\$?\d+\.\d{2}', line):
                potential_items.append(line.strip())
        
        # Convert to structured items (very simplified)
        for item in potential_items:
            parts = item.split()
            if len(parts) >= 3:
                # Attempt to extract quantity, description, and amount
                try:
                    quantity = float(parts[0])
                    amount_str = parts[-1].replace('$', '').replace(',', '')
                    amount = float(amount_str)
                    description = ' '.join(parts[1:-1])
                    
                    extracted_data["line_items"].append({
                        "quantity": quantity,
                        "description": description,
                        "amount": amount
                    })
                except (ValueError, IndexError):
                    # Skip lines that don't fit our expected format
                    continue
    
    def _calculate_confidence(self, extracted_data: Dict[str, Any]) -> float:
        """
        Calculate confidence score for the extracted data.
        
        Args:
            extracted_data: The extracted structured data
            
        Returns:
            Confidence score between 0 and 1
        """
        # Key fields to check (excluding line_items)
        key_fields = ["invoice_number", "vendor_name", "invoice_date", "due_date", "total_amount"]
        
        # Count non-None values for key fields
        non_none_count = sum(1 for field in key_fields if extracted_data.get(field) is not None)
        
        # Calculate base confidence as ratio of found fields to total fields
        base_confidence = non_none_count / len(key_fields)
        
        # Adjust confidence based on presence of critical fields
        # Invoice number and total amount are considered most important
        if extracted_data.get("invoice_number") is None:
            base_confidence *= 0.7  # Reduce confidence if no invoice number
        
        if extracted_data.get("total_amount") is None:
            base_confidence *= 0.7  # Reduce confidence if no total amount
        
        # Add a small boost if we found line items
        if extracted_data.get("line_items"):
            base_confidence = min(base_confidence + 0.1, 1.0)
        
        # Ensure confidence is between 0 and 1
        return max(0.0, min(base_confidence, 1.0))


ai_service = AIService()