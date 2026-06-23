# app/api/routes.py
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models.schemas import APIResponse
from app.services.model_service import predict_image

router = APIRouter()


@router.post("/predict", response_model=APIResponse)
async def predict_dog_breed(file: UploadFile = File(...), threshold: float = 0.35):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Chỉ chấp nhận định dạng ảnh.")

    try:
        print(f"[AI Service] Đang phân tích ảnh: {file.filename}")
        image_bytes = await file.read()

        # Nhờ service chạy logic model
        result = predict_image(image_bytes, threshold)

        return result

    except ValueError as ve:
        raise HTTPException(status_code=422, detail=str(ve))
    except Exception as e:
        print(f"[AI Service] Lỗi hệ thống: {e}")
        raise HTTPException(status_code=500, detail="Lỗi nội bộ máy chủ.")
    finally:
        await file.close()
