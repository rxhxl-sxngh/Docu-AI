from paddleocr import PaddleOCR
import sys

def Process_File(file_path):
    ocr = PaddleOCR(use_angle_cls=True, lang='en')
    result = ocr.ocr(file_path, cls=True)
    print(result)


if __name__ == '__main__':
    fname = sys.argv[1]
    Process_File(fname)