const express = require("express");
const router = express.Router();

const searchController = require("../controllers/search.controller");

// GET /api/search?q=friendly+low+shedding+dogs+for+apartments
router.get("/", searchController.search);

module.exports = router;
