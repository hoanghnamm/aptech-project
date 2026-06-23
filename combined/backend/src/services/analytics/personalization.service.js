const VisitorLog = require("../../models/VisitorLog");
const Breed = require("../../models/Breed");
const { getTrendingBreeds } = require("./visitor-analytics.service");

/**
 * Build personalized content for a visitor session based on the breeds they
 * have viewed. Strategy: look at the user's recently viewed breeds, then
 * recommend OTHER breeds that share the same size / energy level.
 * If the visitor is brand new (no history), fall back to trending breeds.
 */
async function getPersonalized(sessionId, limit = 6) {
  // 1. Recently viewed breed names for this session (most recent first, unique)
  const recentLogs = await VisitorLog.find({
    sessionId,
    eventType: "breed_view",
    breedName: { $ne: null },
  })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  const viewedNames = [...new Set(recentLogs.map((l) => l.breedName))];

  // 2. New visitor -> show trending instead
  if (viewedNames.length === 0) {
    const trending = await getTrendingBreeds(limit);
    const names = trending.map((t) => t.breedName);
    const details = await Breed.find({ breedName: { $in: names } }).lean();
    return {
      personalized: false,
      basedOn: [],
      recommendations: details.slice(0, limit),
    };
  }

  // 3. Gather the attributes of the breeds they liked
  const viewedBreeds = await Breed.find({ breedName: { $in: viewedNames } }).lean();
  const sizes = [...new Set(viewedBreeds.map((b) => b.size).filter(Boolean))];
  const energies = [...new Set(viewedBreeds.map((b) => b.energyLevel).filter(Boolean))];

  // 4. Recommend similar breeds they have NOT already viewed
  const recommendations = await Breed.find({
    breedName: { $nin: viewedNames },
    ...(sizes.length ? { size: { $in: sizes } } : {}),
    ...(energies.length ? { energyLevel: { $in: energies } } : {}),
  })
    .limit(limit)
    .lean();

  return {
    personalized: true,
    basedOn: viewedNames.slice(0, 5),
    recommendations,
  };
}

module.exports = {
  getPersonalized,
};
