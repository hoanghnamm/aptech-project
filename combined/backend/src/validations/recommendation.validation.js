const { body, validationResult } = require("express-validator");

const recommendationRules = [
  body("homeSize")
    .notEmpty().withMessage("homeSize is required")
    .isIn(["apartment", "house_small", "house_large"])
    .withMessage("homeSize must be apartment, house_small, or house_large"),

  body("activityLevel")
    .notEmpty().withMessage("activityLevel is required")
    .isIn(["low", "medium", "high"])
    .withMessage("activityLevel must be low, medium, or high"),

  body("familyType")
    .notEmpty().withMessage("familyType is required")
    .isIn(["single", "couple", "family_kids", "seniors"])
    .withMessage("familyType must be single, couple, family_kids, or seniors"),

  body("climate")
    .optional()
    .isIn(["hot", "cold", "temperate"])
    .withMessage("climate must be hot, cold, or temperate"),

  body("experience")
    .optional()
    .isIn(["first_time", "experienced"])
    .withMessage("experience must be first_time or experienced"),

  body("sheddingTolerance")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("sheddingTolerance must be low, medium, or high"),
];

const validateRecommendation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

module.exports = {
  recommendationRules,
  validateRecommendation,
};
