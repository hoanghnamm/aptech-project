const express = require("express");
const router = express.Router();

const nutritionController = require("../controllers/nutrition.controller");
const { nutritionRules, validateNutrition } = require("../validations/nutrition.validation");
const { optionalAuth } = require("../middlewares/auth.middleware");

router.post(
  "/recommend",
  optionalAuth,
  nutritionRules,
  validateNutrition,
  nutritionController.recommendNutrition
);

module.exports = router;