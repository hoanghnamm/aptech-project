const VisitorLog = require("../../models/VisitorLog");

/**
 * Record a visitor event (page view or breed view).
 */
async function logEvent({ sessionId, eventType, page, breedName }) {
  return VisitorLog.create({ sessionId, eventType, page, breedName });
}

/**
 * Most-viewed breeds across ALL visitors ("trending").
 */
async function getTrendingBreeds(limit = 6) {
  return VisitorLog.aggregate([
    { $match: { eventType: "breed_view", breedName: { $ne: null } } },
    { $group: { _id: "$breedName", views: { $sum: 1 } } },
    { $sort: { views: -1 } },
    { $limit: limit },
    { $project: { _id: 0, breedName: "$_id", views: 1 } },
  ]);
}

/**
 * Overall site stats.
 */
async function getStats() {
  const [totalEvents, pageViews, breedViews, sessions] = await Promise.all([
    VisitorLog.countDocuments({}),
    VisitorLog.countDocuments({ eventType: "page_view" }),
    VisitorLog.countDocuments({ eventType: "breed_view" }),
    VisitorLog.distinct("sessionId"),
  ]);
  return {
    totalEvents,
    pageViews,
    breedViews,
    uniqueVisitors: sessions.length,
  };
}

module.exports = {
  logEvent,
  getTrendingBreeds,
  getStats,
};
