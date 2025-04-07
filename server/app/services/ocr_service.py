# server/app/services/ocr_service.py
import logging
import os
import time
from typing import Dict, List, Any, Optional

from paddleocr import PaddleOCR
import fitz  # PyMuPDF

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class OCRService:
    """
    Service for Optical Character Recognition (OCR) processing.
    """
    
    def __init__(self):
        """Initialize the OCR service with PaddleOCR."""
        try:
            self.ocr = PaddleOCR(use_angle_cls=True, lang='en')
            logger.info("OCR service initialized successfully")
        except Exception as e:
            logger.error(f"Error initializing OCR service: {e}")
            raise
    
    def process_document(self, file_path: str) -> List[Dict[str, Any]]:
        """
        Process document using OCR and extract text and positions.
        
        Args:
            file_path: Path to the document file
            
        Returns:
            List of dictionaries containing extracted text, confidence scores, and positions
        """
        logger.info(f"Processing document: {file_path}")
        
        try:
            # Check if file exists
            if not os.path.exists(file_path):
                error_msg = f"File not found: {file_path}"
                logger.error(error_msg)
                raise FileNotFoundError(error_msg)
            
            # Determine file type
            _, ext = os.path.splitext(file_path)
            
            if ext.lower() == '.pdf':
                return self._process_pdf(file_path)
            else:
                # For image files or other formats, use direct OCR
                return self._process_image(file_path)
                
        except Exception as e:
            logger.error(f"Error processing document: {e}")
            # Return empty result on error
            return []
    
    def _process_pdf(self, file_path: str) -> List[Dict[str, Any]]:
        """Process a PDF document by extracting and OCR'ing each page."""
        logger.info(f"Processing PDF document: {file_path}")
        
        result = []
        
        try:
            # Open the PDF
            doc = fitz.open(file_path)
            
            # Process each page
            for page_num, page in enumerate(doc):
                logger.info(f"Processing page {page_num + 1} of {len(doc)}")
                
                # Try to extract text directly from PDF first
                text = page.get_text()
                
                if text.strip():
                    # If text is available in the PDF, use it
                    logger.info(f"Using embedded text from page {page_num + 1}")
                    
                    # Extract text blocks with their positions
                    blocks = page.get_text("blocks")
                    for block in blocks:
                        # Format: (x0, y0, x1, y1, text, block_no, block_type)
                        x0, y0, x1, y1, block_text, _, _ = block
                        
                        # Skip empty blocks
                        if not block_text.strip():
                            continue
                            
                        result.append({
                            "text": block_text.strip(),
                            "confidence": 1.0,  # High confidence for embedded text
                            "position": [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]
                        })
                
                else:
                    # If no embedded text, render page as image and perform OCR
                    logger.info(f"No embedded text found in page {page_num + 1}, using OCR")
                    
                    # Get a pixmap/image of the page
                    pix = page.get_pixmap()
                    
                    # Save to a temporary file
                    temp_img_path = f"temp_page_{page_num}.png"
                    pix.save(temp_img_path)
                    
                    # Process with OCR
                    page_result = self._process_image(temp_img_path)
                    result.extend(page_result)
                    
                    # Clean up temporary file
                    try:
                        os.remove(temp_img_path)
                    except OSError:
                        pass
            
            return result
            
        except Exception as e:
            logger.error(f"Error processing PDF: {e}")
            return []
    
    def _process_image(self, image_path: str) -> List[Dict[str, Any]]:
        """Process an image using OCR."""
        logger.info(f"Processing image: {image_path}")
        
        try:
            # Run OCR on the image
            ocr_result = self.ocr.ocr(image_path, cls=True)
            
            # Process the result
            return self._structure_result(ocr_result)
            
        except Exception as e:
            logger.error(f"Error performing OCR on image: {e}")
            return []
    
    def _structure_result(self, ocr_result: List) -> List[Dict[str, Any]]:
        """
        Convert OCR result to structured data.
        
        Args:
            ocr_result: Raw OCR result from PaddleOCR
            
        Returns:
            List of dictionaries with text, confidence, and position
        """
        structured_data = []
        
        # Check if result is None or empty
        if not ocr_result:
            return structured_data
        
        # Process the OCR result format
        for page_result in ocr_result:
            if not page_result:
                continue
                
            for line in page_result:
                # Extract the text, confidence, and coordinates
                if isinstance(line, list) and len(line) >= 2:
                    coordinates = line[0]  # Position coordinates
                    text_info = line[1]    # [text, confidence]
                    
                    if isinstance(text_info, tuple) and len(text_info) >= 2:
                        text = text_info[0]
                        confidence = text_info[1]
                        
                        # Skip empty text
                        if not text or not text.strip():
                            continue
                        
                        structured_data.append({
                            "text": text.strip(),
                            "confidence": float(confidence),
                            "position": coordinates
                        })
        
        logger.info(f"Structured {len(structured_data)} text blocks from OCR result")
        return structured_data


ocr_service = OCRService()