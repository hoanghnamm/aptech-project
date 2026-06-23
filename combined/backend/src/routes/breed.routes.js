const express = require("express");
const router = express.Router();

const breedController = require("../controllers/breed.controller");

// GET /api/breeds            -> list (supports ?search=&size=&page=&limit=)
// GET /api/breeds/:idOrName  -> single breed by id or name
router.get("/", breedController.listBreeds);
router.get("/:idOrName", breedController.getBreed);

module.exports = router;
