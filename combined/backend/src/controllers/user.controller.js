const UserPreference = require("../models/UserPreference");
const BreedRecognitionHistory = require("../models/BreedRecognitionHistory");
const { sendSuccess } = require("../utils/response");

/**
 * GET /api/user/preferences — fetch preferences for current user.
 */
const getPreferences = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    let prefs = await UserPreference.findOne({ userId }).lean();
    if (!prefs) {
      prefs = { viewedBreeds: [], searchHistory: [], favoriteBreeds: [] };
    }
    return sendSuccess(res, prefs, "User preferences fetched");
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/user/preferences/view — record a breed view.
 * Body: { breedName, size?, energyLevel? }
 */
const recordBreedView = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { breedName, size, energyLevel } = req.body;

    if (!breedName) {
      return res.status(400).json({ success: false, message: "breedName is required" });
    }

    let prefs = await UserPreference.findOne({ userId });
    if (!prefs) {
      prefs = new UserPreference({ userId, viewedBreeds: [], searchHistory: [], favoriteBreeds: [] });
    }

    // Check if breed already exists in viewed list
    const existing = prefs.viewedBreeds.find(
      (b) => b.breedName.toLowerCase() === breedName.toLowerCase()
    );

    if (existing) {
      existing.viewCount += 1;
      existing.lastViewedAt = new Date();
      if (size) existing.size = size;
      if (energyLevel) existing.energyLevel = energyLevel;
    } else {
      prefs.viewedBreeds.push({
        breedName,
        size: size || null,
        energyLevel: energyLevel || null,
        viewCount: 1,
        lastViewedAt: new Date(),
      });
    }

    await prefs.save();
    return sendSuccess(res, prefs, "Breed view recorded");
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/user/recognition-history — fetch breed recognition history.
 */
const getRecognitionHistory = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const limit = Math.min(Number(req.query.limit) || 20, 50);

    const history = await BreedRecognitionHistory.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return sendSuccess(res, history, "Recognition history fetched");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPreferences,
  recordBreedView,
  getRecognitionHistory,
};
