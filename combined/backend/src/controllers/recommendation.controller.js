const recommendationService = require("../services/ai/breed-recommendation.service");
const { sendSuccess } = require("../utils/response");

const recommendBreeds = async (req, res, next) => {
  try {
    const result = await recommendationService.recommendBreeds(req.body);
    return sendSuccess(res, result, "Breed recommendations generated");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  recommendBreeds,
};
