const { body, validationResult } = require("express-validator");

const nutritionRules = [
  body("breedName")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage("breedName must be a string")
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("breedName must be between 2 and 80 characters"),

  body("breedId")
    .optional({ nullable: true, checkFalsy: true })
    .isMongoId()
    .withMessage("breedId must be a valid MongoDB ObjectId"),

  body().custom((_, { req }) => {
    const hasBreedName =
      typeof req.body.breedName === "string" &&
      req.body.breedName.trim().length > 0;

    const hasBreedId =
      typeof req.body.breedId === "string" &&
      req.body.breedId.trim().length > 0;

    if (!hasBreedName && !hasBreedId) {
      throw new Error("Either breedName or breedId is required");
    }
    return true;
  }),

  body("ageMonths")
    .notEmpty()
    .withMessage("ageMonths is required")
    .isInt({ min: 1, max: 240 })
    .withMessage("ageMonths must be between 1 and 240"),

  body("weightKg")
    .notEmpty()
    .withMessage("weightKg is required")
    .isFloat({ min: 0.5, max: 200 })
    .withMessage("weightKg must be between 0.5 and 200"),

  body("size")
    .notEmpty()
    .withMessage("size is required")
    .isIn(["toy", "small", "medium", "large", "giant"])
    .withMessage("size must be one of: toy, small, medium, large, giant"),

  body("activityLevel")
    .notEmpty()
    .withMessage("activityLevel is required")
    .isIn(["low", "medium", "high"])
    .withMessage("activityLevel must be one of: low, medium, high"),

  body("lifeStage")
    .notEmpty()
    .withMessage("lifeStage is required")
    .isIn(["puppy", "adult", "senior"])
    .withMessage("lifeStage must be one of: puppy, adult, senior"),

  body("goal")
    .optional()
    .isIn(["maintain", "gain", "lose"])
    .withMessage("goal must be one of: maintain, gain, lose"),

  body("climate")
    .optional()
    .isIn(["hot", "cold", "temperate", "humid"])
    .withMessage("climate must be one of: hot, cold, temperate, humid"),

  body("mealCountPreference")
    .optional()
    .isInt({ min: 1, max: 6 })
    .withMessage("mealCountPreference must be between 1 and 6"),

  body("allergies")
    .optional()
    .isArray()
    .withMessage("allergies must be an array"),

  body("healthIssues")
    .optional()
    .isArray()
    .withMessage("healthIssues must be an array"),
];

const validateNutrition = (req, res, next) => {
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
  nutritionRules,
  validateNutrition,
};