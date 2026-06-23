const express = require("express");
const router = express.Router();

const vetController = require("../controllers/vet.controller");

// GET /api/vet/nearby?lat=&lng=&open24h=true
router.get("/nearby", vetController.nearby);

module.exports = router;
