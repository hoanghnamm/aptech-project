const express = require("express");
const router = express.Router();

const analyticsController = require("../controllers/analytics.controller");

router.post("/track", analyticsController.track);
router.get("/personalized", analyticsController.personalized);
router.get("/trending", analyticsController.trending);

module.exports = router;
