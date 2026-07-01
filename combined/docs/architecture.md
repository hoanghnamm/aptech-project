# Architecture — PawIntel AI

Three cooperating services plus MongoDB.

```
Frontend (React/Vite)  →  Backend (Node/Express API)  →  Python AI Service (FastAPI + Keras)
        :5173                       :5000                              :8000
                                      │
                                      └──► MongoDB (breeds, history, gallery, logs, ...)
```

| Service     | Folder           | Port | Role                                                      |
| ----------- | ---------------- | ---- | -------------------------------------------------------- |
| Frontend    | `frontend/`      | 5173 | React SPA (encyclopedia, recognition, chatbot, nutrition) |
| Backend     | `backend/`       | 5000 | Express REST API, business logic, AI gateway              |
| AI Service  | `python-backend/`| 8000 | Keras model `/predict` for dog-breed recognition          |
| Database    | MongoDB          | 27017| Breed catalog + user-generated history/logs               |

## Request flows

**Breed identification (image):**
Browser uploads image → `POST /api/breed/identify` → Node forwards multipart to Python
`/predict` → Keras model returns top-3 breeds + confidence → Node enriches each with the
`Breed` document from MongoDB → response to browser.

**Text AI (chatbot / search / recommendation / nutrition):**
Browser → Node controller → `services/ai/*` → Groq LLM (`config/groq`) → structured JSON
→ (optionally persisted to a `*History` collection) → response.

**Vet nearby:** Browser sends `lat/lng` → Node computes Haversine distance against
`data/clinics.json` → sorted list.

**Analytics:** Browser posts session events → `VisitorLog` collection → personalization
service derives trending/personalized breeds.

## Backend layout (`backend/src/`)

- `routes/` — Express routers, mounted under `/api/*` in `app.js`
- `controllers/` — HTTP handlers (thin)
- `services/` — business logic, grouped: `ai/`, `breed/`, `image/`, `nutrition/`, `vet/`, `analytics/`
- `models/` — Mongoose schemas (see [database.md](./database.md))
- `middlewares/` — `auth.middleware` (JWT), `upload.middleware` (multer memoryStorage)
- `validations/` — express-validator rule sets per route
- `prompts/` — LLM prompt templates per feature
- `config/` — `groq`, DB connection
- `seed/` — `breeds.json` + `seedBreeds.js`; `data/clinics.json` — vet dataset

## AI service (`python-backend/app/`)

- `main.py` — FastAPI app, `/predict` endpoint
- `services/model_service.py` — loads `dog_breed_model.keras`, preprocess (224×224), top-3 with 0.35 confidence threshold
- `core/config.py` — model path, `IMG_SIZE`, `CLASS_NAMES` (120 breeds)

## Tech stack

React + Vite · Node.js + Express + Mongoose · Python + FastAPI + TensorFlow/Keras + Pillow ·
Groq LLM API · MongoDB · JWT (jsonwebtoken).

## Running

Use the numbered launchers in order, or `run-all.bat`:
`1-seed-database.bat` → `2-run-python-backend.bat` → `3-run-node-backend.bat` → `4-run-frontend.bat`.
See root [README.md](../README.md) for manual steps and `.env` setup.
