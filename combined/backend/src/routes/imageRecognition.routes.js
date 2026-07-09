const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload.middleware");
const imageRecognitionController = require("../controllers/imageRecognition.controller");
const { optionalAuth } = require("../middlewares/auth.middleware");

// POST /api/breed/identify  -> upload 1 ảnh dưới key "image"
router.post(
  "/identify",
  optionalAuth,
  upload.single("image"),
  imageRecognitionController.identifyBreed
);

module.exports = router;
