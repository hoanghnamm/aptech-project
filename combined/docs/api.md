# API Reference — PawIntel AI Backend

Base URL: `http://localhost:5000`
All endpoints are prefixed with `/api`. Mounted in `backend/src/app.js`.

Auth: most endpoints use `optionalAuth` — they work anonymously, and attach a user
if a valid `Authorization: Bearer <JWT>` header is present. There is **no login/register
endpoint yet** (see [SUBMISSION-GAPS.md](../SUBMISSION-GAPS.md)).

---

## Breed Recognition (AI image)

### `POST /api/breed/identify`
Upload a dog photo; forwarded to the Python Keras microservice, top-3 predictions
enriched with breed details from MongoDB.
- Body: `multipart/form-data`, field `image` (single file)
- Returns: `{ success, predictions: [{ breed, confidence, ...breedDetails }], message }`

---

## Encyclopedia (breeds)

### `GET /api/breeds`
List breeds. Query params: `search`, `size`, `page`, `limit`.

### `GET /api/breeds/:idOrName`
Single breed by `breedId` or `name`.

---

## Chatbot (AI)

### `POST /api/chatbot` · `optionalAuth`
- Body: `{ "message": string (required), "history"?: array }`
- Returns: assistant reply (Groq LLM).

---

## Recommendation (AI)

### `POST /api/recommendation` · `optionalAuth`
- Body: `{ homeSize, activityLevel, familyType, climate, experience }`
  - `homeSize`: `apartment | house_small | house_large`
  - `activityLevel`: `low | medium | high`
  - `familyType`: `single | couple | family_kids | seniors`
  - `climate`: `hot | cold | temperate`
  - `experience`: `first_time | experienced`
- Returns: recommended breeds.

---

## Smart Search (NLP)

### `GET /api/search?q=...`
Natural-language breed search, e.g. `?q=friendly low shedding dogs for apartments`.

---

## Nutrition (AI)

### `POST /api/nutrition/recommend` · `optionalAuth`
- Body: `{ breedName (required), breedId?, ageMonths?, weightKg?, size?, activityLevel?, lifeStage? }`
  - `size`: `toy | small | medium | large | giant`
  - `activityLevel`: `low | medium | high`
  - `lifeStage`: `puppy | adult | senior`
- Returns: feeding plan + schedule.

---

## Gallery (AI tagging)

### `POST /api/gallery` · `optionalAuth`
- Body: `multipart/form-data`, field `image`. Uploads + auto-tags via AI.

### `GET /api/gallery`
List tagged images.

---

## Vet Assistance (geolocation)

### `GET /api/vet/nearby?lat=&lng=&open24h=true`
Nearby clinics sorted by Haversine distance. `open24h` optional.

---

## Visitor Analytics

### `POST /api/analytics/track`
Body: `{ sessionId, eventType: "page_view" | "breed_view", page?, breedName? }`

### `GET /api/analytics/personalized`
Personalized breed suggestions for the session.

### `GET /api/analytics/trending`
Trending breeds from visitor logs.
