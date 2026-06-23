# 🐾 PawIntel AI (Combined)

An AI pet portal combining the full **E-project-1** application (chatbot, nutrition,
recommendations, encyclopedia, auth) with the **real dog-breed recognition model**
from PawIntel-AI.

Breed recognition is powered by a TensorFlow/Keras model (`dog_breed_model.keras`,
120 breeds) served by a Python FastAPI microservice. The Node backend forwards
uploaded images to it and enriches predictions with breed details from MongoDB.

## 🧱 Architecture

```
Frontend (React/Vite)  →  Backend (Node/Express API)  →  Python AI Service (FastAPI + Keras)
        :5173                       :5000                              :8000
                                      │
                                      └──► MongoDB (breeds, users, history, ...)
```

| Service        | Folder           | Port | Role                                                   |
| -------------- | ---------------- | ---- | ------------------------------------------------------ |
| Frontend       | `frontend/`      | 5173 | React UI (Home, Breed Recognition, Chatbot, Nutrition) |
| Backend        | `backend/`       | 5000 | Express REST API, business logic, AI gateway           |
| AI Service     | `python-backend/`| 8000 | Keras model `/predict` for dog-breed recognition       |

## ✅ Prerequisites

- Node.js >= 18
- Python >= 3.9
- MongoDB running locally (or a connection string)

## 🚀 Run (3 terminals)

### 1. Python AI service
```powershell
cd python-backend
python -m venv venv
.\venv\Scripts\Activate
pip install -r requirements.txt
Copy-Item .env.example .env
python -m app.main
```
→ http://localhost:8000  (the trained `dog_breed_model.keras` must sit in this folder)

### 2. Backend (Node)
```powershell
cd backend
npm install
Copy-Item .env.example .env   # then edit MONGO_URI / GROQ_API_KEY
npm run seed                  # one-time: load breed data into MongoDB
npm run dev
```
→ http://localhost:5000

### 3. Frontend
```powershell
cd frontend
npm install
npm run dev
```
→ http://localhost:5173

## 🔌 How breed recognition is wired

1. `frontend` → `src/api/breed.api.js` posts the image (`multipart/form-data`, key `image`)
   to `POST /api/breed/identify`.
2. `backend` → `imageRecognition.routes.js` → `imageRecognition.controller.js` →
   `services/ai/breed-identification.service.js` forwards the image to the Python
   service (`PYTHON_AI_SERVICE_URL`, default `http://localhost:8000/predict`).
3. `python-backend` runs the Keras model and returns the Top-3 breeds with confidence.
4. The backend maps each predicted breed name to the `Breed` collection in MongoDB
   to attach origin, temperament, health issues, etc., then returns the enriched result.

> Note: only the trained model (`dog_breed_model.keras`) is used — the training
> dataset is not part of this project.
