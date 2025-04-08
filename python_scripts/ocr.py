import fitz
from paddleocr import PaddleOCR
import sys
import json

def Process_File(file_path):
    ocr = PaddleOCR(use_angle_cls=True, lang='en')
    result = ocr.ocr(file_path, cls=True)[0]
    #print(result)
    obj = [{f"{x[1][0]}":x[1][1]} for x in result]
    #print(obj[0])
    #print(obj)
    print(json.dumps(obj,separators=(',', ':')))



if __name__ == '__main__':
    fname = sys.argv[1]
    Process_File(fname)