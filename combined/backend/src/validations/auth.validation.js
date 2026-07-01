const { body, validationResult } = require("express-validator");

const registerRules = [
  body("name")
    .notEmpty()
    .withMessage("name is required")
    .isString()
    .trim()
    .isLength({ min: 1, max: 80 })
    .withMessage("name must be between 1 and 80 characters"),

  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("email must be valid")
    .normalizeEmail(),

  body("password")
    .isString()
    .isLength({ min: 6, max: 100 })
    .withMessage("password must be between 6 and 100 characters"),
];

const loginRules = [
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("email must be valid")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("password is required"),
];

const validateAuth = (req, res, next) => {
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
  registerRules,
  loginRules,
  validateAuth,
};
