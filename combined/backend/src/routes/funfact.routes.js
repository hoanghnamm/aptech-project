const express = require("express");
const { getRandomFunFact } = require("../controllers/funfact.controller");

const router = express.Router();

router.get("/random", getRandomFunFact);

module.exports = router;
