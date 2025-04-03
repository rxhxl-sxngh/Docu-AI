import os
from typing import Dict, List, Any

from paddleocr import PaddleOCR


class OCRService:
    def __init__(self):
        self.ocr = PaddleOCR(use_angle_cls=True, lang='en')
        
    def process_document(self, file_path: str) -> List[Dict[str, Any]]:
        """
        Process document using OCR
        """
        try:
            result = self.ocr.ocr(file_path, cls=True)
            # Process and structure the OCR result
            structured_result = self._structure_result(result)
            return structured_result
        except Exception as e:
            # Log the error
            print(f"Error processing document: {e}")
            return []
    
    def _structure_result(self, result: List) -> List[Dict[str, Any]]:
        """
        Convert OCR result to structured data
        """
        structured_data = []
        
        # Process the OCR result format
        for line in result:
            for box in line:
                text = box[1][0]  # The recognized text
                confidence = box[1][1]  # The confidence score
                coordinates = box[0]  # The position of the text
                
                structured_data.append({
                    "text": text,
                    "confidence": confidence,
                    "position": coordinates
                })
        
        return structured_data


ocr_service = OCRService()