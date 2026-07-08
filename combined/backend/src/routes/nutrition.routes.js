/**
 * Nutrition Routes — Enhanced with breed autocomplete (F1) and history endpoints (F8)
 */

const express = require("express");
const router = express.Router();

const nutritionController = require("../controllers/nutrition.controller");
const { nutritionRules, validateNutrition } = require("../validations/nutrition.validation");
const { optionalAuth } = require("../middlewares/auth.middleware");

// Main recommendation
router.post(
  "/recommend",
  optionalAuth,
  nutritionRules,
  validateNutrition,
  nutritionController.recommendNutrition
);

// F1: Breed autocomplete for nutrition form
router.get("/breeds/autocomplete", nutritionController.breedAutocomplete);

// F8: Get nutrition history for comparing plans
router.get("/history", optionalAuth, nutritionController.getNutritionHistory);

module.exports = router;