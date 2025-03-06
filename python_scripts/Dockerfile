FROM python:latest

WORKDIR /usr/src/app

COPY . .

RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y
RUN pip install --no-cache-dir -r reqs.txt

ENV NAME=World

CMD ["python","./ocr.py","file_uploads/invoice_1.pdf"]
