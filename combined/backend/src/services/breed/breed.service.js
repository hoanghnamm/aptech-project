const mongoose = require("mongoose");
const Breed = require("../../models/Breed");

/**
 * Normalizes a breed document into the standard target schema format.
 * This bridges the gap between the breeds.json layout and Breed.js model layout.
 */
function normalizeBreed(breed) {
  if (!breed) return null;

  const name = breed.name || breed.breedName || "Unknown Breed";
  const breedName = breed.breedName || breed.name || "Unknown Breed";
  const breedId = breed.breedId || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const size = breed.lifestyleFilters?.size || breed.size || "medium";
  const sheddingLevel = breed.lifestyleFilters?.sheddingLevel || breed.sheddingLevel || "medium";
  const spaceRequirement = breed.lifestyleFilters?.spaceRequirement || breed.spaceRequirement || (breed.apartmentFriendly ? "Apartment" : "Large Yard");
  const barkingLevel = breed.lifestyleFilters?.barkingLevel || breed.barkingLevel || "moderate";
  const weatherTolerance = breed.lifestyleFilters?.weatherTolerance || breed.weatherTolerance || "adaptable";
  const vulnerabilityToDisease = breed.lifestyleFilters?.vulnerabilityToDisease || breed.vulnerabilityToDisease || "moderate";

  const weight = breed.physicalStats?.weight || breed.weight || "?";
  const height = breed.physicalStats?.height || breed.height || "?";
  const lifespan = breed.physicalStats?.lifespan || breed.lifeExpectancy || "?";

  const coreTraits = breed.coreTraits || breed.temperament || [];
  const careAdvice = breed.careAdvice || [];
  const healthRisks = breed.healthRisks || breed.healthIssues || [];

  const historySnippet = breed.historySnippet || breed.description || "No historical archives available for this breed.";

  const breedSpecificFacts = breed.breedSpecificFacts || [
    `The ${name} is historically cataloged for its unique behavioral adaptabilities.`,
    `Records indicate strong utility and companionship traits across different epochs.`
  ];

  const energyValue = breed.energyLevel === "high" ? 5 : breed.energyLevel === "medium" ? 3 : 2;
  const comparisonMetrics = breed.comparisonMetrics || {
    trainability: breed.trainability || 3,
    energyLevel: energyValue,
    apartmentFriendly: breed.apartmentFriendly === true ? 5 : 2,
    kidFriendly: breed.familyFriendly === true ? 5 : 3,
    aloneTolerance: 3,
    petFriendly: 3,
  };

  return {
    ...breed,
    _id: breed._id,
    breedId,
    name,
    breedName,
    size,
    historySnippet,
    breedSpecificFacts,
    comparisonMetrics,
    lifestyleFilters: {
      size,
      sheddingLevel,
      spaceRequirement,
      barkingLevel,
      weatherTolerance,
      vulnerabilityToDisease,
    },
    physicalStats: {
      weight,
      height,
      lifespan,
    },
    coreTraits,
    careAdvice,
    healthRisks,
  };
}

/**
 * List breeds with advanced queries + pagination. Supporting both DB schema variants.
 */
async function listBreeds({
  search,
  size,
  sheddingLevel,
  spaceRequirement,
  barkingLevel,
  weatherTolerance,
  vulnerabilityToDisease,
  energyLevel,
  page = 1,
  limit = 24,
} = {}) {
  const andClauses = [];

  if (search && search.trim()) {
    const rx = { $regex: search.trim(), $options: "i" };
    andClauses.push({
      $or: [
        { name: rx },
        { breedName: rx },
        { description: rx },
      ],
    });
  }

  if (size) {
    andClauses.push({
      $or: [
        { "lifestyleFilters.size": { $regex: `^${size}$`, $options: "i" } },
        { size: { $regex: `^${size}$`, $options: "i" } },
      ],
    });
  }

  if (sheddingLevel) {
    andClauses.push({
      $or: [
        { "lifestyleFilters.sheddingLevel": { $regex: `^${sheddingLevel}$`, $options: "i" } },
        { sheddingLevel: { $regex: `^${sheddingLevel}$`, $options: "i" } },
      ],
    });
  }

  if (spaceRequirement) {
    andClauses.push({
      $or: [
        { "lifestyleFilters.spaceRequirement": { $regex: `^${spaceRequirement}$`, $options: "i" } },
        { spaceRequirement: { $regex: `^${spaceRequirement}$`, $options: "i" } },
      ],
    });
  }

  if (barkingLevel) {
    andClauses.push({
      $or: [
        { "lifestyleFilters.barkingLevel": { $regex: `^${barkingLevel}$`, $options: "i" } },
        { barkingLevel: { $regex: `^${barkingLevel}$`, $options: "i" } },
      ],
    });
  }

  if (weatherTolerance) {
    andClauses.push({
      $or: [
        { "lifestyleFilters.weatherTolerance": { $regex: `^${weatherTolerance}$`, $options: "i" } },
        { weatherTolerance: { $regex: `^${weatherTolerance}$`, $options: "i" } },
      ],
    });
  }

  if (vulnerabilityToDisease) {
    andClauses.push({
      $or: [
        { "lifestyleFilters.vulnerabilityToDisease": { $regex: `^${vulnerabilityToDisease}$`, $options: "i" } },
        { vulnerabilityToDisease: { $regex: `^${vulnerabilityToDisease}$`, $options: "i" } },
      ],
    });
  }

  if (energyLevel) {
    const levelsStr = Array.isArray(energyLevel) ? energyLevel.join(",") : String(energyLevel || "");
    if (levelsStr.trim()) {
      const levels = levelsStr.split(",").map(Number).filter((n) => !isNaN(n));
      const textLevels = levelsStr.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);

      if (levels.length > 0 || textLevels.length > 0) {
        const energyOr = [];
        if (levels.length > 0) {
          energyOr.push({ "comparisonMetrics.energyLevel": { $in: levels } });
        }
        if (textLevels.length > 0) {
          const mappedText = [];
          if (levels.includes(1) || levels.includes(2)) mappedText.push("low");
          if (levels.includes(3)) mappedText.push("medium", "moderate");
          if (levels.includes(4) || levels.includes(5)) mappedText.push("high");

          const finalTexts = Array.from(new Set([...textLevels, ...mappedText]));
          energyOr.push({ energyLevel: { $in: finalTexts } });
        }
        andClauses.push({ $or: energyOr });
      }
    }
  }

  const query = andClauses.length > 0 ? { $and: andClauses } : {};

  const pageNum = Math.max(1, Number(page) || 1);
  const perPage = Math.min(100, Math.max(1, Number(limit) || 24));
  const skip = (pageNum - 1) * perPage;

  const [items, total] = await Promise.all([
    Breed.find(query).sort({ name: 1, breedName: 1 }).skip(skip).limit(perPage).lean(),
    Breed.countDocuments(query),
  ]);

  return {
    items: items.map(normalizeBreed),
    total,
    page: pageNum,
    limit: perPage,
    totalPages: Math.ceil(total / perPage),
  };
}

/**
 * Fetch a single breed by Mongo ObjectId or by (case-insensitive) name/breedId.
 */
async function getBreed(idOrName) {
  if (mongoose.isValidObjectId(idOrName)) {
    const byId = await Breed.findById(idOrName).lean();
    if (byId) return normalizeBreed(byId);
  }
  const byQuery = await Breed.findOne({
    $or: [
      { breedId: { $regex: `^${idOrName}$`, $options: "i" } },
      { name: { $regex: `^${idOrName}$`, $options: "i" } },
      { breedName: { $regex: `^${idOrName}$`, $options: "i" } },
    ],
  }).lean();
  return normalizeBreed(byQuery);
}

module.exports = {
  listBreeds,
  getBreed,
  normalizeBreed,
};

