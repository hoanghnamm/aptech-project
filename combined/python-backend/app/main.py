import os
import sys

# Đảm bảo stdout/stderr dùng UTF-8 để in được tiếng Việt trên Windows (cp1252)
for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding="utf-8")
    except (AttributeError, ValueError):
        pass

from fastapi import FastAPI
from dotenv import load_dotenv  # Đã sửa ở đây: chỉ giữ lại load_dotenv
from app.api.routes import router as predict_router
import uvicorn

# Nạp các biến môi trường từ file .env vào hệ thống
load_dotenv()

app = FastAPI(title="Dog Breed AI Microservice", version="1.0")

# Nhúng các router vào
app.include_router(predict_router)

if __name__ == "__main__":
    # Đọc PORT từ file .env, nếu không có thì mặc định là 8000
    port_env = int(os.getenv("PORT", 8000))
    
    # Đọc trạng thái DEBUG từ .env để bật/tắt reload code
    debug_env = os.getenv("DEBUG", "False").lower() in ("true", "1", "t")

    print(f"🚀 Python AI Service đang chạy tại port: {port_env} (Reload: {debug_env})")

    # Chạy uvicorn server
    uvicorn.run("app.main:app", host="0.0.0.0", port=port_env, reload=debug_env)