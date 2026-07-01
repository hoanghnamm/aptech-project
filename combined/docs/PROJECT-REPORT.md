# Project Report — AI-Driven PawIntel Portal

Aptech eProject submission report.

---

## 1. Problem Definition

Traditional dog-information websites serve the same static content to every visitor:
no personalization, no intelligent interaction, no way to identify a breed from a photo.
Users struggle to identify breeds, get tailored care guidance, or search naturally.

**PawIntel AI** is an AI-driven single-page web application that provides personalized,
intelligent, and interactive information about dogs — combining image recognition,
natural-language search, an AI chatbot, breed/nutrition recommendations, a dynamic
encyclopedia, geolocation-based vet suggestions, and visitor analytics.

## 2. Objectives

- Responsive, dynamic AI-powered web portal.
- Dog-breed identification from user-uploaded images.
- Intelligent breed and nutrition recommendations.
- AI chatbot for pet-care queries.
- Natural-language ("smart") search.
- Database-driven dog encyclopedia.
- Geolocation-based veterinary assistance.
- Visitor analytics and personalization.

## 3. Scope

In scope: the nine core features above, JWT-based authentication, and a three-service
architecture (React frontend, Node API gateway, Python AI microservice) backed by MongoDB.
Out of scope: native mobile apps, payment/e-commerce, live vet chat.

## 4. Design Specifications

### 4.1 Architecture
Three cooperating services + MongoDB. See [architecture.md](./architecture.md) and the
system diagram in [diagrams.md](./diagrams.md).

| Layer | Technology | Responsibility |
|---|---|---|
| Frontend | React + Vite | SPA UI, routing, API calls |
| Backend | Node.js + Express + Mongoose | REST API, business logic, AI gateway, auth |
| AI service | Python + FastAPI + TensorFlow/Keras | Dog-breed image recognition |
| Text AI | Groq LLM API | Chatbot, search, recommendation, nutrition |
| Database | MongoDB | Breed catalog + user-generated history/logs |

### 4.2 Key design decisions
- **Microservice split** isolates the heavy TensorFlow model from the Node API, so each
  scales and deploys independently.
- **AI gateway pattern**: the Node backend is the single entry point; it forwards images
  to Python and text prompts to Groq, then enriches results from MongoDB.
- **Passwords** hashed with Node's built-in `crypto.scrypt` (salted, timing-safe compare) —
  no third-party hashing dependency.
- **Optional auth** on content endpoints: anonymous use is allowed; a valid JWT simply
  attaches the user for history/personalization.

### 4.3 Data model
Six implemented collections: `User`, `Breed` (`dogbreeds`), `ChatHistory`,
`GalleryImage`, `NutritionHistory`, `VisitorLog`. Full field definitions in
[database.md](./database.md); ERD in [diagrams.md](./diagrams.md).

### 4.4 API
REST under `/api/*`. Full endpoint list, request bodies, and enums in [api.md](./api.md).

### 4.5 Diagrams
Architecture, breed-identification flowchart, authentication flowchart, DFD (level 1),
and ERD — all in [diagrams.md](./diagrams.md).

## 5. Feature → Implementation Map

| Feature | Frontend | Backend |
|---|---|---|
| Breed identification | `pages/BreedRecognition/` | `POST /api/breed/identify` → Python `/predict` |
| Encyclopedia | `pages/Encyclopedia/` | `GET /api/breeds`, `/api/breeds/:idOrName` |
| Chatbot | `pages/Chatbot/` | `POST /api/chatbot` (Groq) |
| Recommendation | `pages/Recommendation/` | `POST /api/recommendation` (Groq) |
| Smart search | `pages/Search/` | `GET /api/search` (Groq NLP) |
| Nutrition | `pages/Nutrition/` | `POST /api/nutrition/recommend` (Groq) |
| Gallery + AI tagging | `pages/Gallery/` | `POST/GET /api/gallery` |
| Vet assistance | `pages/VetAssistance/` | `GET /api/vet/nearby` (Haversine) |
| Analytics | `pages/Insights/` | `/api/analytics/*` |
| Authentication | `pages/Auth/` | `/api/auth/register\|login\|me` (JWT) |

## 6. Test Data

- `backend/src/seed/breeds.json` — dog-breed catalog, loaded by `seedBreeds.js`.
- `backend/src/data/clinics.json` — vet clinics with coordinates for the nearby search.
- Recognition test data: any dog photo of one of the 120 model classes
  (`python-backend/app/core/config.py` → `CLASS_NAMES`).

## 7. Installation & Run

Prerequisites: Node ≥ 18, Python ≥ 3.9, MongoDB. See root [README.md](../README.md).
Quick path (Windows): run `1-seed-database.bat` → `2-run-python-backend.bat` →
`3-run-node-backend.bat` → `4-run-frontend.bat` (or `run-all.bat`). Copy
`backend/.env.example` → `backend/.env` and set `GROQ_API_KEY`.

## 8. Assumptions

See [ASSUMPTIONS.md](./ASSUMPTIONS.md).

## 9. Deliverables Checklist

- [x] Source code (frontend, backend, python-backend)
- [x] Design specifications (this report + `architecture.md`)
- [x] Diagrams — flowcharts, DFD, ERD (`diagrams.md`)
- [x] API documentation (`api.md`) and database documentation (`database.md`)
- [x] Test data (`breeds.json`, `clinics.json`)
- [x] Installation instructions (`README.md`, `.bat` launchers)
- [x] Assumptions (`ASSUMPTIONS.md`)
- [ ] Demo video clip — **to be recorded and added before final submission**
