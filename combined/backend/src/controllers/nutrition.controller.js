/**
 * Nutrition Controller — Enhanced with autocomplete (F1) and history (F8)
 */

const nutritionService = require("../services/nutrition/nutrition.service");
const Breed = require("../models/Breed");
const NutritionHistory = require("../models/NutritionHistory");
const { adaptBreedForNutrition } = require("../services/nutrition/breed-nutrition-adapter");
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

/**
 * F1: Breed autocomplete — returns matching breeds with nutrition-relevant info
 * GET /api/nutrition/breeds/autocomplete?q=golden&limit=8
 */
const breedAutocomplete = async (req, res, next) => {
  try {
    const query = String(req.query.q || "").trim();
    const limit = Math.min(Number(req.query.limit) || 8, 20);

    if (!query || query.length < 2) {
      return sendSuccess(res, [], "Provide at least 2 characters to search");
    }

    const regex = { $regex: query, $options: "i" };
    const breeds = await Breed.find({
      $or: [
        { name: regex },
        { breedName: regex },
      ],
    })
      .limit(limit)
      .lean();

    const adapted = breeds.map((b) => {
      const adapted = adaptBreedForNutrition(b);
      return {
        _id: b._id,
        breedName: adapted.breedName,
        size: adapted.size,
        energyLevel: adapted.energyLevel,
        origin: adapted.origin,
        thumbnail: adapted.thumbnail,
        lifeExpectancy: adapted.lifeExpectancy,
        idealWeightRange: adapted.idealWeightRange,
      };
    });

    return sendSuccess(res, adapted, "Breeds found");
  } catch (error) {
    next(error);
  }
};

/**
 * F8: Get nutrition history for the current user
 * GET /api/nutrition/history?limit=10
 */
const getNutritionHistory = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id || null;
    const limit = Math.min(Number(req.query.limit) || 10, 50);

    const query = userId ? { userId } : {};
    const history = await NutritionHistory.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return sendSuccess(res, history, "Nutrition history fetched");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  recommendNutrition,
  breedAutocomplete,
  getNutritionHistory,
};