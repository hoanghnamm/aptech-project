const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const { authenticate } = require("../middlewares/auth.middleware");

// All routes require authentication
router.use(authenticate);

router.get("/preferences", userController.getPreferences);
router.post("/preferences/view", userController.recordBreedView);
router.get("/recognition-history", userController.getRecognitionHistory);

module.exports = router;
