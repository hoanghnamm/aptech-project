const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload.middleware");
const imageRecognitionController = require("../controllers/imageRecognition.controller");

// POST /api/breed/identify  -> upload 1 ảnh dưới key "image"
router.post(
  "/identify",
  upload.single("image"),
  imageRecognitionController.identifyBreed
);

module.exports = router;
