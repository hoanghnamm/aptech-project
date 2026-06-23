const { body, validationResult } = require("express-validator");

const chatRules = [
  body("message")
    .notEmpty()
    .withMessage("message is required")
    .isString()
    .withMessage("message must be a string")
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage("message must be between 1 and 2000 characters"),

  body("history")
    .optional()
    .isArray()
    .withMessage("history must be an array"),
];

const validateChat = (req, res, next) => {
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
  chatRules,
  validateChat,
};
