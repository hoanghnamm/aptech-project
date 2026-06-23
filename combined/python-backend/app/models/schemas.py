# app/models/schemas.py
from pydantic import BaseModel
from typing import List

class BreedPrediction(BaseModel):
    breed: str
    confidence: float

class APIResponse(BaseModel):
    success: bool
    predictions: List[BreedPrediction]
    message: str