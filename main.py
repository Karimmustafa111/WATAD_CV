from fastapi import FastAPI, UploadFile, File
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from sahi import AutoDetectionModel
from sahi.predict import get_sliced_prediction
from PIL import Image
import io
import tempfile
import os

app = FastAPI(title="WATAD Crack Detection API")

print("جاري تحميل موديل SAHI...")
detection_model = AutoDetectionModel.from_pretrained(
    model_type='yolov8',
    model_path='best.pt',
    confidence_threshold=0.5,
    device="cpu" 
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/detect/")
async def detect_cracks(file: UploadFile = File(...)):
    image_data = await file.read()
    image = Image.open(io.BytesIO(image_data)).convert("RGB")
    
    result = get_sliced_prediction(
        image, 
        detection_model,
        slice_height=960,
        slice_width=960,
        overlap_height_ratio=0.2,
        overlap_width_ratio=0.2,
        postprocess_type="NMS",
        postprocess_match_threshold=0.2
    )
    
    with tempfile.TemporaryDirectory() as tmp_dir:
        result.export_visuals(export_dir=tmp_dir, file_name="result")
        
        output_path = os.path.join(tmp_dir, "result.png")
        
        with open(output_path, "rb") as f:
            img_bytes = f.read()
            
    return Response(content=img_bytes, media_type="image/png")