/**
 * Nutrition Service — Full Upgrade (B1-B6)
 * Orchestrates: breed resolution → adapter → engine → AI → normalize → save
 */

const Breed = require("../../models/Breed");
const NutritionHistory = require("../../models/NutritionHistory");
const { buildNutritionBaseline } = require("./nutrition-engine.service");
const { generateNutritionRecommendation } = require("../ai/nutrition-ai.service");
const { adaptBreedForNutrition } = require("./breed-nutrition-adapter");

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
    // B3: Body Condition Score (1-9)
    bodyConditionScore: data.bodyConditionScore
      ? Number(data.bodyConditionScore)
      : null,
    // B6: Neutered/Spayed
    isNeutered: data.isNeutered === true || data.isNeutered === "true",
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
    healthRisks: [],
    idealWeightRange: null,
    tendencyToObesity: "low",
    breedSpecificNeeds: [],
    commonAllergies: [],
    nutritionProfile: {
      caloriesPerKg: 35,
      proteinRequirement: "medium",
      fatRequirement: "medium",
      carbRequirement: "medium",
      proteinPercent: { min: 22, max: 26 },
      fatPercent: { min: 12, max: 18 },
      carbPercent: { min: 45, max: 55 },
      fiberPercent: { min: 3, max: 5 },
    },
    description:
      "Fallback breed profile generated from user input when breed is not found in database.",
  };
}

async function resolveBreed(input) {
  // Try by MongoDB _id
  if (input.breedId) {
    const byId = await Breed.findById(input.breedId).lean();
    if (byId) return byId;
  }

  // Try by breedName (case-insensitive exact match)
  if (input.breedName) {
    const escaped = escapeRegex(input.breedName.trim());
    const byName = await Breed.findOne({
      $or: [
        { breedName: { $regex: new RegExp(`^${escaped}$`, "i") } },
        { name: { $regex: new RegExp(`^${escaped}$`, "i") } },
      ],
    }).lean();

    if (byName) return byName;
  }

  return null;
}

function generateWeeklyMealPlanFallback(caloriesPerDay, mealsPerDay, recommendedFoods) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const foods = recommendedFoods.length > 0 ? recommendedFoods : ["High-quality adult kibble", "Lean turkey", "Brown rice", "Sweet potato"];

  const caloriesPerMeal = Math.round(caloriesPerDay / mealsPerDay);

  // Rotation options for variety
  const mealCombos = [
    {
      breakfast: [foods[0], foods[1] || "Lean turkey"],
      dinner: [foods[0], foods[2] || "Brown rice"],
      lunch: [foods[3] || "Sweet potato", "Boiled egg"]
    },
    {
      breakfast: [foods[0], foods[2] || "Sweet potato"],
      dinner: [foods[1] || "Lean turkey", foods[3] || "Pumpkin"],
      lunch: ["Boiled egg", "Salmon"]
    },
    {
      breakfast: [foods[0], "Steamed broccoli"],
      dinner: [foods[0], foods[1] || "Lean turkey"],
      lunch: [foods[2] || "Brown rice", "Plain yogurt"]
    }
  ];

  return days.map((day, dayIdx) => {
    const combo = mealCombos[dayIdx % mealCombos.length];
    const meals = [];

    const mealTypes = mealsPerDay === 1
      ? ["Dinner"]
      : mealsPerDay === 2
      ? ["Breakfast", "Dinner"]
      : ["Breakfast", "Lunch", "Dinner"];

    mealTypes.forEach((type) => {
      let items = [];
      if (type === "Breakfast") items = combo.breakfast;
      else if (type === "Lunch") items = combo.lunch;
      else items = combo.dinner;

      items = [...new Set(items)].slice(0, 3);
      const portionGrams = Math.round(caloriesPerMeal / 1.35);

      meals.push({
        type,
        items,
        portionGrams,
        calories: caloriesPerMeal
      });
    });

    return { day, meals };
  });
}

function sanitizeAndCompleteWeeklyMealPlan(aiPlan, caloriesPerDay, mealsPerDay, recommendedFoods) {
  const targetDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const fallbackPlan = generateWeeklyMealPlanFallback(caloriesPerDay, mealsPerDay, recommendedFoods);

  if (!Array.isArray(aiPlan) || aiPlan.length === 0) {
    return fallbackPlan;
  }

  const aiDayMap = {};
  aiPlan.forEach((d) => {
    if (!d || typeof d !== "object") return;
    const dayStr = String(d.day || "").toLowerCase().trim();
    if (!dayStr) return;

    if (dayStr.includes("mon")) aiDayMap["Monday"] = d;
    else if (dayStr.includes("tue")) aiDayMap["Tuesday"] = d;
    else if (dayStr.includes("wed")) aiDayMap["Wednesday"] = d;
    else if (dayStr.includes("thu")) aiDayMap["Thursday"] = d;
    else if (dayStr.includes("fri")) aiDayMap["Friday"] = d;
    else if (dayStr.includes("sat")) aiDayMap["Saturday"] = d;
    else if (dayStr.includes("sun")) aiDayMap["Sunday"] = d;
  });

  return targetDays.map((day, idx) => {
    if (aiDayMap[day]) {
      const meals = Array.isArray(aiDayMap[day].meals) && aiDayMap[day].meals.length > 0
        ? aiDayMap[day].meals.map((m) => ({
            type: String(m.type || "Meal"),
            items: Array.isArray(m.items) ? m.items.map(String) : ["High-quality kibble"],
            portionGrams: Number(m.portionGrams) || Math.round((caloriesPerDay / mealsPerDay) / 1.35),
            calories: Number(m.calories) || Math.round(caloriesPerDay / mealsPerDay)
          }))
        : fallbackPlan[idx].meals;
      
      return { day, meals };
    } else {
      return fallbackPlan[idx];
    }
  });
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

  // B4: Weekly meal plan from AI, sanitized and completed with fallback for Saturday & Sunday
  const weeklyMealPlan = sanitizeAndCompleteWeeklyMealPlan(
    aiResponse?.weeklyMealPlan,
    safeCalories,
    safeMeals,
    baseEstimate.recommendedFoods
  );


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
    // Enhanced fields — pass through from engine
    macronutrients: baseEstimate.macronutrients,
    bodyConditionScore: baseEstimate.bodyConditionScore,
    weightStatus: baseEstimate.weightStatus,
    healthAlerts: baseEstimate.healthAlerts || [],
    weeklyMealPlan,
  };
}

async function recommendNutrition(inputData, userId = null) {
  const input = normalizeInput(inputData);

  // B1: Resolve breed from DB and adapt to nutrition format
  const rawBreed = await resolveBreed(input);
  const breedContext = rawBreed
    ? adaptBreedForNutrition(rawBreed)
    : buildFallbackBreed(input);
  const breedMatched = !!rawBreed;

  // Build baseline with all enhancements (B2-B6)
  const baseEstimate = buildNutritionBaseline(input, breedContext);

  // AI refinement (B4: includes weekly meal plan request)
  const aiResponse = await generateNutritionRecommendation({
    breed: breedContext,
    input,
    baseEstimate,
    breedMatched,
  });

  const finalRecommendation = normalizeAiResponse(aiResponse, baseEstimate);

  const history = await NutritionHistory.create({
    userId,
    breedId: rawBreed?._id || null,
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