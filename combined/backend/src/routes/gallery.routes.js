const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload.middleware");
const galleryController = require("../controllers/gallery.controller");
const { optionalAuth } = require("../middlewares/auth.middleware");

// POST /api/gallery       -> upload + AI tag (form-data key "image")
// GET  /api/gallery       -> list tagged images
router.post("/", optionalAuth, upload.single("image"), galleryController.uploadImage);
router.get("/", galleryController.listImages);

module.exports = router;
