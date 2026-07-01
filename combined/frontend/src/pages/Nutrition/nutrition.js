const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const { buildNutritionBaseline } = require('../src/services/nutrition/nutrition-engine.service');
// Giả định bạn có model Breed hoặc dùng file JSON
const breedsData = require('../src/seed/breeds.json'); 

dotenv.config();

router.post('/recommend', async (req, res) => {
  console.log(">>> [DEBUG BACKEND] 1. Payload received from Frontend:", req.body);

  const { breedName, ageMonths, weightKg, activityLevel, lifeStage, goal } = req.body;

  try {
    // Step 2: Compare with Database (Mock or Real DB)
    console.log(">>> [DEBUG BACKEND] 2. Querying Database for breed:", breedName);
    
    const breed = breedsData.find(b => 
      b.breedName.toLowerCase() === breedName.toLowerCase()
    );

    if (breed) {
      console.log(">>> [DEBUG BACKEND] 3. Breed found in DB:", breed.breedName);
    } else {
      console.warn(">>> [DEBUG BACKEND] 3. Breed not found in DB, using fallback logic.");
    }

    // Step 3: Run calculation Engine
    const nutritionData = buildNutritionBaseline(req.body, breed);
    
    console.log(">>> [DEBUG BACKEND] 4. Engine calculation results:", {
      calories: nutritionData.caloriesPerDay,
      foods: nutritionData.recommendedFoods.length
    });

    const result = {
      recommendation: nutritionData,
      breed: breed || { breedName: "Unknown", nutritionProfile: {} },
      breedMatched: !!breed
    };

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error(">>> [DEBUG BACKEND] ERROR CRITICAL:", error.message);
    res.status(500).json({
      success: false,
      message: "System error: " + error.message
    });
  }
});

module.exports = router;