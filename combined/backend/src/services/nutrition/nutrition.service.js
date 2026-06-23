const Breed = require("../../models/Breed");
const NutritionHistory = require("../../models/NutritionHistory");
const { buildNutritionBaseline } = require("./nutrition-engine.service");
const { generateNutritionRecommendation } = require("../ai/nutrition-ai.service");

function normalizeInput(data) {
  return {
    ...data,
    breedName: String(data.breedName || "").trim(),
    breedId: String(data.breedId || "").trim(),
    size: String(data.size || "").toLowerCase(),
    activityLevel: String(data.activityLevel || "").toLowerCase(),
    lifeStage: String(data.lifeStage || "").toLowerCase(),
    goal: String(data.goal || "maintain").toLowerCase(),
    climate: data.climate ? String(data.climate).toLowerCase() : undefined,
    allergies: Array.isArray(data.allergies) ? data.allergies : [],
    healthIssues: Array.isArray(data.healthIssues) ? data.healthIssues : [],
    mealCountPreference: data.mealCountPreference
      ? Number(data.mealCountPreference)
      : null,
    ageMonths: Number(data.ageMonths),
    weightKg: Number(data.weightKg),
  };
}

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const uniqueStrings = (arr = []) =>
  [...new Set(arr.filter(Boolean).map((item) => String(item).trim()))];

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildFallbackBreed(input) {
  return {
    breedName: input.breedName || "Unknown Breed",
    origin: "Unknown",
    size: input.size || "medium",
    energyLevel: input.activityLevel || "medium",
    lifeExpectancy: "Unknown",
    temperament: [],
    sheddingLevel: "medium",
    familyFriendly: true,
    apartmentFriendly: true,
    nutritionProfile: {
      caloriesPerKg: 35,
      proteinRequirement: "medium",
      fatRequirement: "medium",
      carbRequirement: "medium",
    },
    description:
      "Fallback breed profile generated from user input when breed is not found in database.",
  };
}

async function resolveBreed(input) {
  if (input.breedId) {
    const byId = await Breed.findById(input.breedId).lean();
    if (byId) return byId;
  }

  if (input.breedName) {
    const escaped = escapeRegex(input.breedName.trim());
    const byName = await Breed.findOne({
      breedName: { $regex: new RegExp(`^${escaped}$`, "i") },
    }).lean();

    if (byName) return byName;
  }

  return null;
}

function normalizeAiResponse(aiResponse, baseEstimate) {
  const aiCalories = Number(aiResponse?.caloriesPerDay);
  const safeCalories = Number.isFinite(aiCalories)
    ? clamp(
        Math.round(aiCalories),
        Math.round(baseEstimate.caloriesPerDay * 0.7),
        Math.round(baseEstimate.caloriesPerDay * 1.3)
      )
    : baseEstimate.caloriesPerDay;

  const aiMeals = Number(aiResponse?.mealsPerDay);
  const safeMeals = Number.isFinite(aiMeals)
    ? clamp(Math.round(aiMeals), 1, 6)
    : baseEstimate.mealsPerDay;

  return {
    caloriesPerDay: safeCalories,
    mealsPerDay: safeMeals,
    recommendedFoods: uniqueStrings([
      ...(baseEstimate.recommendedFoods || []),
      ...(Array.isArray(aiResponse?.recommendedFoods)
        ? aiResponse.recommendedFoods
        : []),
    ]),
    avoidFoods: uniqueStrings([
      ...(baseEstimate.avoidFoods || []),
      ...(Array.isArray(aiResponse?.avoidFoods) ? aiResponse.avoidFoods : []),
    ]),
    feedingSchedule:
      Array.isArray(aiResponse?.feedingSchedule) &&
      aiResponse.feedingSchedule.length > 0
        ? aiResponse.feedingSchedule
        : baseEstimate.feedingSchedule,
    hydrationTips:
      typeof aiResponse?.hydrationTips === "string" &&
      aiResponse.hydrationTips.trim()
        ? aiResponse.hydrationTips.trim()
        : baseEstimate.hydrationTips,
    warningFlags: uniqueStrings([
      ...(baseEstimate.warningFlags || []),
      ...(Array.isArray(aiResponse?.warningFlags) ? aiResponse.warningFlags : []),
    ]),
    confidence: clamp(Number(aiResponse?.confidence ?? 0.8), 0, 1),
    summary:
      typeof aiResponse?.summary === "string" && aiResponse.summary.trim()
        ? aiResponse.summary.trim()
        : "This nutrition plan is based on breed context, life stage, activity level, and backend nutrition heuristics.",
    portionGuidance:
      typeof aiResponse?.portionGuidance === "string" &&
      aiResponse.portionGuidance.trim()
        ? aiResponse.portionGuidance.trim()
        : baseEstimate.portionGuidance,
    supplementSuggestions: uniqueStrings([
      ...(baseEstimate.supplementSuggestions || []),
      ...(Array.isArray(aiResponse?.supplementSuggestions)
        ? aiResponse.supplementSuggestions
        : []),
    ]),
  };
}

async function recommendNutrition(inputData, userId = null) {
  const input = normalizeInput(inputData);

  const breed = await resolveBreed(input);
  const breedContext = breed || buildFallbackBreed(input);
  const breedMatched = !!breed;

  const baseEstimate = buildNutritionBaseline(input, breedContext);

  const aiResponse = await generateNutritionRecommendation({
    breed: breedContext,
    input,
    baseEstimate,
    breedMatched,
  });

  const finalRecommendation = normalizeAiResponse(aiResponse, baseEstimate);

  const history = await NutritionHistory.create({
    userId,
    breedId: breed?._id || null,
    breedName: breedContext.breedName,
    breedMatched,
    breedSnapshot: breedContext,
    requestData: inputData,
    baseEstimate,
    aiResponse: finalRecommendation,
    modelUsed: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
  });

  return {
    recommendation: finalRecommendation,
    historyId: history._id,
    breed: breedContext,
    breedMatched,
  };
}

module.exports = {
  recommendNutrition,
};