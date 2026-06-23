const express = require("express");
const router = express.Router();

const recommendationController = require("../controllers/recommendation.controller");
const { recommendationRules, validateRecommendation } = require("../validations/recommendation.validation");
const { optionalAuth } = require("../middlewares/auth.middleware");

router.post(
  "/",
  optionalAuth,
  recommendationRules,
  validateRecommendation,
  recommendationController.recommendBreeds
);

module.exports = router;
