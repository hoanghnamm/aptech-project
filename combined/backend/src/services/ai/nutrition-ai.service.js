const { callGroqStructured } = require("./groq.service");
const { buildNutritionMessages } = require("../../prompts/nutrition/nutrition.prompt");

const nutritionSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "caloriesPerDay",
    "mealsPerDay",
    "recommendedFoods",
    "avoidFoods",
    "feedingSchedule",
    "hydrationTips",
    "warningFlags",
    "confidence",
    "summary",
    "portionGuidance",
    "supplementSuggestions",
  ],
  properties: {
    caloriesPerDay: { type: "number" },
    mealsPerDay: { type: "integer" },
    recommendedFoods: { type: "array", items: { type: "string" } },
    avoidFoods: { type: "array", items: { type: "string" } },
    feedingSchedule: { type: "array", items: { type: "string" } },
    hydrationTips: { type: "string" },
    warningFlags: { type: "array", items: { type: "string" } },
    confidence: { type: "number" },
    summary: { type: "string" },
    portionGuidance: { type: "string" },
    supplementSuggestions: { type: "array", items: { type: "string" } },
  },
};

async function generateNutritionRecommendation({ breed, input, baseEstimate, breedMatched }) {
  const messages = buildNutritionMessages({ breed, input, baseEstimate, breedMatched });

  try {
    return await callGroqStructured({
      messages,
      schemaName: "nutrition_recommendation",
      schema: nutritionSchema,
    });
  } catch (error) {
    return {
      caloriesPerDay: baseEstimate.caloriesPerDay,
      mealsPerDay: baseEstimate.mealsPerDay,
      recommendedFoods: baseEstimate.recommendedFoods,
      avoidFoods: baseEstimate.avoidFoods,
      feedingSchedule: baseEstimate.feedingSchedule,
      hydrationTips: baseEstimate.hydrationTips,
      warningFlags: baseEstimate.warningFlags,
      confidence: 0.6,
      summary: "AI service temporarily unavailable. Returned a safe backend-generated nutrition baseline.",
      portionGuidance: baseEstimate.portionGuidance,
      supplementSuggestions: baseEstimate.supplementSuggestions || [],
    };
  }
}

module.exports = {
  generateNutritionRecommendation,
};