# Diagrams — PawIntel AI

Flowcharts, Data Flow Diagram (DFD), and Entity-Relationship Diagram (ERD) for the
project report. Rendered with Mermaid (GitHub renders these natively).

---

## 1. System Architecture

```mermaid
flowchart LR
    U([User / Browser])
    FE[React + Vite SPA<br/>:5173]
    BE[Node + Express API<br/>:5000]
    AI[Python FastAPI<br/>Keras model :8000]
    DB[(MongoDB<br/>:27017)]
    LLM[[Groq LLM API]]

    U <--> FE
    FE <--> BE
    BE <--> DB
    BE -->|image /predict| AI
    BE -->|chat / search / recommend / nutrition| LLM
```

---

## 2. Breed Identification — Flowchart

```mermaid
flowchart TD
    A[User uploads dog photo] --> B[POST /api/breed/identify]
    B --> C{Valid image file?}
    C -->|No| E[400 validation error]
    C -->|Yes| D[Node forwards multipart to Python /predict]
    D --> F[Keras model: preprocess 224x224 + predict]
    F --> G{Max confidence >= 0.35?}
    G -->|No| H[Return: could not confidently identify]
    G -->|Yes| I[Top-3 breeds + confidence]
    I --> J[Node looks up each breed in MongoDB]
    J --> K[Merge model output + breed details]
    K --> L[Return enriched predictions to browser]
```

---

## 3. Authentication — Flowchart

```mermaid
flowchart TD
    R[POST /api/auth/register] --> RV{Validation ok?}
    RV -->|No| R400[400 errors]
    RV -->|Yes| RE{Email exists?}
    RE -->|Yes| R409[409 conflict]
    RE -->|No| RH[scrypt hash password] --> RS[Save User] --> RT[Sign JWT 7d] --> ROK[201 token + user]

    L[POST /api/auth/login] --> LU{User found?}
    LU -->|No| L401[401 invalid]
    LU -->|Yes| LV{verifyPassword ok?}
    LV -->|No| L401
    LV -->|Yes| LT[Sign JWT 7d] --> LOK[200 token + user]
```

---

## 4. Data Flow Diagram (DFD — Level 1)

```mermaid
flowchart LR
    subgraph External
        User([User])
        Groq[[Groq LLM]]
        Keras[[Keras Model]]
    end

    User -->|image| P1((1.0 Identify Breed))
    User -->|preferences| P2((2.0 Recommend / Search))
    User -->|question| P3((3.0 Chatbot))
    User -->|breed + age| P4((4.0 Nutrition))
    User -->|lat/lng| P5((5.0 Vet Nearby))
    User -->|events| P6((6.0 Analytics))

    P1 --> Keras
    P2 --> Groq
    P3 --> Groq
    P4 --> Groq

    P1 --> D1[(Breeds)]
    P2 --> D1
    P3 --> D2[(ChatHistory)]
    P4 --> D3[(NutritionHistory)]
    P5 --> D4[(clinics.json)]
    P6 --> D5[(VisitorLog)]

    P1 --> User
    P2 --> User
    P3 --> User
    P4 --> User
    P5 --> User
    P6 --> User
```

---

## 5. Database ERD

```mermaid
erDiagram
    USER ||--o{ CHATHISTORY : "writes"
    USER ||--o{ GALLERYIMAGE : "uploads"
    USER ||--o{ NUTRITIONHISTORY : "requests"
    BREED ||--o{ NUTRITIONHISTORY : "referenced by"

    USER {
        ObjectId _id
        string name
        string email UK
        string password "scrypt hash, select:false"
    }
    BREED {
        string breedId UK
        string name
        string origin
        object lifestyleFilters
        object physicalStats
        object comparisonMetrics
    }
    CHATHISTORY {
        ObjectId userId FK
        string userMessage
        string assistantReply
    }
    GALLERYIMAGE {
        ObjectId userId FK
        string imageUrl
        string breed
        number confidence
    }
    NUTRITIONHISTORY {
        ObjectId userId FK
        ObjectId breedId FK
        string breedName
        object aiResponse
    }
    VISITORLOG {
        string sessionId
        string eventType
        string page
        string breedName
    }
```

> `VISITORLOG` is keyed by anonymous `sessionId` (no user FK). See [database.md](./database.md).
