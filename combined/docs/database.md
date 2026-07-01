# Database — PawIntel AI (MongoDB / Mongoose)

Connection: `MONGO_URI` (default `mongodb://localhost:27017/pawintel`).
Schemas live in `backend/src/models/`. All use `{ timestamps: true }`
(`createdAt` / `updatedAt`) unless noted.

## Collections

### `Breed` → collection `dogbreeds`
The encyclopedia catalog (seeded from `seed/breeds.json`).

| Field | Type | Notes |
|---|---|---|
| `breedId` | String | required, unique, indexed |
| `name` | String | required |
| `origin` | String | default `"Unknown"` |
| `description` | String | |
| `thumbnail` | String | |
| `lifestyleFilters` | Object | `size, sheddingLevel, spaceRequirement, barkingLevel, weatherTolerance, vulnerabilityToDisease` |
| `physicalStats` | Object | `weight, height, lifespan` |
| `coreTraits` | [String] | |
| `careAdvice` | [String] | |
| `healthRisks` | [String] | |
| `comparisonMetrics` | Object (Numbers) | `trainability, energyLevel, apartmentFriendly, kidFriendly, aloneTolerance, petFriendly` |
| `visualArchives` | [{ url, caption }] | gallery images |

### `ChatHistory`
| Field | Type | Notes |
|---|---|---|
| `userId` | ObjectId → User | nullable (anonymous allowed) |
| `userMessage` | String | required |
| `assistantReply` | String | required |
| `context` | [{ role: "user"\|"assistant", content }] | conversation turns |

### `GalleryImage`
| Field | Type | Notes |
|---|---|---|
| `userId` | ObjectId → User | nullable |
| `imageUrl` | String | required |
| `fileName` | String | required |
| `breed` | String | AI-tagged, nullable |
| `confidence` | Number | nullable |
| `tags` | [String] | AI tags |

### `NutritionHistory`
| Field | Type | Notes |
|---|---|---|
| `userId` | ObjectId → User | nullable |
| `breedId` | ObjectId → Breed | nullable |
| `breedName` | String | required |
| `breedMatched` | Boolean | default false |
| `breedSnapshot` | Object | |
| `requestData` | Object | required (input params) |
| `baseEstimate` | Object | required (rule-based estimate) |
| `aiResponse` | Object | required (LLM output) |
| `modelUsed` | String | default `GROQ_MODEL` |

### `VisitorLog`
| Field | Type | Notes |
|---|---|---|
| `sessionId` | String | required, indexed |
| `eventType` | String | enum `page_view` \| `breed_view` |
| `page` | String | nullable |
| `breedName` | String | nullable |

## Not yet implemented (empty schema files)

These models are referenced but their files are empty stubs — see
[SUBMISSION-GAPS.md](../SUBMISSION-GAPS.md):

- `User` — referenced by `userId` refs above; blocks real authentication.
- `UserPreference` — intended for personalization persistence.
- `BreedRecognitionHistory` — intended to store past identification results.
