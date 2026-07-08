const express = require("express");
const router = express.Router();
const newsController = require("../controllers/news.controller");

// GET /api/dog-news
router.get("/", newsController.getLatestDogNews);

module.exports = router;
