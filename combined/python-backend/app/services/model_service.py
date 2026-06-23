# app/services/model_service.py
import os
import io
import numpy as np
import tensorflow as tf
from PIL import Image
from app.core.config import MODEL_PATH, IMG_SIZE, CLASS_NAMES

# Tải mô hình toàn cục
if os.path.exists(MODEL_PATH):
    print(f"[AI Service] Đang tải mô hình từ {MODEL_PATH}...")
    model = tf.keras.models.load_model(MODEL_PATH)
    print("[AI Service] Tải mô hình thành công!")
else:
    raise FileNotFoundError(f"Không tìm thấy file mô hình tại {MODEL_PATH}.")

def preprocess_image(image_bytes: bytes) -> np.ndarray:
    try:
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img = img.resize(IMG_SIZE)
        img_array = np.array(img, dtype=np.float32)
        img_array = np.expand_dims(img_array, axis=0)
        return img_array
    except Exception as e:
        raise ValueError(f"Lỗi phân tích hình ảnh: {str(e)}")

def predict_image(image_bytes: bytes, threshold: float = 0.35) -> dict:
    input_data = preprocess_image(image_bytes)
    predictions_distribution = model.predict(input_data, verbose=0)[0]
    
    highest_idx = np.argmax(predictions_distribution)
    max_confidence = float(predictions_distribution[highest_idx])

    if max_confidence < threshold:
        return {
            "success": False,
            "predictions": [],
            "message": f"Không thể nhận diện rõ ràng. Độ tin cậy ({max_confidence*100:.1f}%) chưa đạt chuẩn."
        }

    top_3_indices = np.argsort(predictions_distribution)[-3:][::-1]
    result_list = [
        {
            "breed": CLASS_NAMES[idx],
            "confidence": round(float(predictions_distribution[idx]), 4)
        }
        for idx in top_3_indices
    ]

    return {
        "success": True,
        "predictions": result_list,
        "message": "Nhận diện thành công."
    }