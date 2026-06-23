const analyticsService = require("../services/analytics/visitor-analytics.service");
const personalizationService = require("../services/analytics/personalization.service");
const { sendSuccess, sendError } = require("../utils/response");

// POST /api/analytics/track   { sessionId, type, page?, breedName? }
const track = async (req, res, next) => {
  try {
    const { sessionId, type, page, breedName } = req.body;
    if (!sessionId || !["page_view", "breed_view"].includes(type)) {
      return sendError(res, "sessionId and a valid type are required", 400);
    }
    await analyticsService.logEvent({ sessionId, eventType: type, page, breedName });
    return sendSuccess(res, { logged: true }, "Event tracked");
  } catch (error) {
    next(error);
  }
};

// GET /api/analytics/personalized?sessionId=...
const personalized = async (req, res, next) => {
  try {
    const sessionId = req.query.sessionId;
    if (!sessionId) return sendError(res, "sessionId is required", 400);
    const result = await personalizationService.getPersonalized(sessionId);
    return sendSuccess(res, result, "Personalized content");
  } catch (error) {
    next(error);
  }
};

// GET /api/analytics/trending
const trending = async (req, res, next) => {
  try {
    const [breeds, stats] = await Promise.all([
      analyticsService.getTrendingBreeds(),
      analyticsService.getStats(),
    ]);
    return sendSuccess(res, { trending: breeds, stats }, "Trending + stats");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  track,
  personalized,
  trending,
};
