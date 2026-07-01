# Submission Status — AI-Driven PawIntel (eProject)

Audit of the codebase against `AI-Driven-PawIntel.doc`, with remediation.
The **application** meets all 9 functional + non-functional requirements.

Status: ❌ not done · ⚠️ incomplete · ✅ done

**Only one item remains: record the demo video (§1).** Everything else is complete.

---

## 1. Documentation deliverables (spec: "Project Deliverables")

| Item | Status | Result |
|---|---|---|
| Flowcharts / DFDs / ERD | ✅ | `docs/diagrams.md` — architecture, breed-ID flowchart, auth flowchart, DFD (L1), ERD (Mermaid). |
| `docs/api.md` | ✅ | Filled from `backend/src/routes/` + validation rules. |
| `docs/architecture.md` | ✅ | Filled from structure + service flows. |
| `docs/database.md` | ✅ | Filled from `backend/src/models/` schemas. |
| Formal Project Report | ✅ | `docs/PROJECT-REPORT.md` — problem definition, design specs, feature map, deliverables checklist. |
| Assumptions (`ReadMe.doc`) | ✅ | `docs/ASSUMPTIONS.md`. **Export to `.doc`/`.pdf` for the final zip.** |
| Demo video clip | ❌ | **Still required.** Record a walkthrough of the working site and add to the submission zip. |

---

## 2. Setup / install correctness

| Item | Status | Result |
|---|---|---|
| `backend/.env.example` | ✅ | Restored (from commit `7105588c`; all 8 env vars used in code verified). |
| README install steps consistency | ⚠️ | Re-verify the 4 `.bat` launchers on a clean clone before submission (needs MongoDB + `GROQ_API_KEY`). |

---

## 3. Authentication — now implemented ✅

Non-functional requirement "**Ensure secure user authentication**" is now met.

| File | Status | Result |
|---|---|---|
| `backend/src/models/User.js` | ✅ | User schema; password hashed with built-in `crypto.scrypt` (salted, timing-safe), `select:false`, stripped from JSON. |
| `backend/src/controllers/auth.controller.js` | ✅ | `register`, `login`, `me` — issues JWT (7d). |
| `backend/src/routes/auth.routes.js` | ✅ | `POST /register`, `POST /login`, `GET /me` (guarded). |
| `backend/src/validations/auth.validation.js` | ✅ | express-validator rules. |
| `backend/src/app.js` | ✅ | `/api/auth` mounted. |
| `frontend/src/api/auth.api.js` | ✅ | `register`, `login`, `me`, `logout` (token in localStorage). |
| `backend/src/models/User.selfcheck.js` | ✅ | Runnable hash/verify check — passes (`node src/models/User.selfcheck.js`). |

No bcrypt dependency added — used Node's built-in `crypto.scrypt`.

Still empty (unused, not referenced anywhere — left as YAGNI stubs):
`models/UserPreference.js`, `models/BreedRecognitionHistory.js`. Implement only if
you add per-user preference persistence or stored recognition history.

---

## 4. Merge cleanup — done ✅

Deleted the 11 orphaned flat page files left by the frontend merge (verified nothing
imported them; `App.jsx` uses the nested versions). `pages/` is now all-nested.

---

## 5. Requirements met (reference)

Functional: ✅ Breed Identification (real Keras model) · ✅ Chatbot · ✅ Recommendation ·
✅ Smart Search (NLP) · ✅ Encyclopedia · ✅ Nutrition · ✅ Gallery + AI tagging ·
✅ Vet geolocation (Haversine) · ✅ Visitor analytics.

Non-functional: ✅ Responsive React/Vite SPA · ✅ JWT authentication · ✅ Microservice
architecture · ✅ Seed/test data (`breeds.json`, `clinics.json`).
