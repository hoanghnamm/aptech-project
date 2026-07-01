const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const {
  registerRules,
  loginRules,
  validateAuth,
} = require("../validations/auth.validation");
const { authenticate } = require("../middlewares/auth.middleware");

router.post("/register", registerRules, validateAuth, authController.register);
router.post("/login", loginRules, validateAuth, authController.login);
router.get("/me", authenticate, authController.me);

module.exports = router;
