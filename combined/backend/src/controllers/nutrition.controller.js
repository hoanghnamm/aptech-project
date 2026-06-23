const nutritionService = require("../services/nutrition/nutrition.service");
const { sendSuccess } = require("../utils/response");

const recommendNutrition = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id || null;
    const result = await nutritionService.recommendNutrition(req.body, userId);

    return sendSuccess(res, result, "Nutrition recommendation generated successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  recommendNutrition,
};