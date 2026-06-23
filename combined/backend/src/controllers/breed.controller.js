const breedService = require("../services/breed/breed.service");
const { sendSuccess, sendError } = require("../utils/response");

const listBreeds = async (req, res, next) => {
  try {
    const { search, size, page, limit } = req.query;
    const result = await breedService.listBreeds({ search, size, page, limit });
    return sendSuccess(res, result, "Breeds fetched");
  } catch (error) {
    next(error);
  }
};

const getBreed = async (req, res, next) => {
  try {
    const breed = await breedService.getBreed(req.params.idOrName);
    if (!breed) {
      return sendError(res, "Breed not found", 404);
    }
    return sendSuccess(res, breed, "Breed fetched");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listBreeds,
  getBreed,
};
