# Assumptions

Assumptions made while building the AI-Driven PawIntel portal.

> For final submission the spec asks for a `ReadMe.doc`. Export this file (and the
> project report) to `.doc`/`.pdf` and include them in the submission zip.

1. **MongoDB runs locally** at `mongodb://localhost:27017/pawintel` unless `MONGO_URI`
   is overridden in `backend/.env`.
2. **Groq API key required** for the text-AI features (chatbot, search, recommendation,
   nutrition). Set `GROQ_API_KEY` in `backend/.env`; without it those endpoints fail.
   Image recognition does **not** need Groq (it uses the local Keras model).
3. **The Keras model file** `python-backend/dog_breed_model.keras` is present and matches
   the 120 `CLASS_NAMES` in `python-backend/app/core/config.py`.
4. **Recognition confidence threshold** is 0.35; below it the service returns
   "could not confidently identify" instead of a guess.
5. **Breed names from the model match `Breed.name`/`breedId`** in MongoDB, so predictions
   can be enriched with encyclopedia details. The database must be seeded first
   (`1-seed-database.bat`).
6. **Vet data is a static seed** (`backend/src/data/clinics.json`), not a live clinic API.
   The browser supplies `lat`/`lng` via the Geolocation API; distance is computed with the
   Haversine formula.
7. **Authentication is optional** for content endpoints — anonymous users can use all
   features; logging in only attaches user identity for history/personalization.
   Passwords are hashed with Node's built-in `crypto.scrypt` (no bcrypt dependency).
8. **Ports**: frontend 5173, Node backend 5000, Python AI 8000. Change via each service's
   env/config if occupied.
9. **Modern browser** with JavaScript and (for vet nearby) Geolocation permission enabled.
10. **Development configuration** is assumed (`NODE_ENV=development`); production hardening
    (HTTPS, secret management, rate limiting) is out of scope for this eProject.
