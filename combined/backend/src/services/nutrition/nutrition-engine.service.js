const { calculateCalories } = require("../../utils/calculateCalories");
const { buildFeedingSchedule } = require("./feeding-schedule.service");

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const uniqueStrings = (arr = []) =>
  [...new Set(arr.filter(Boolean).map((item) => String(item).trim()))];

function getMealsPerDay(lifeStage, mealCountPreference = null) {
  if (mealCountPreference) {
    return clamp(Number(mealCountPreference), 1, 6);
  }

  if (lifeStage === "puppy") return 3;
  if (lifeStage === "senior") return 2;
  return 2;
}

function buildHydrationTips(climate) {
  return String(climate || "").toLowerCase() === "hot"
    ? "Increase water access, feed at cooler times, and avoid intense activity in hot weather."
    : "Keep fresh water available all day and monitor water intake regularly.";
}

function buildAvoidFoods(allergies = [], healthIssues = []) {
  const foodMap = {
    chicken: "Chicken",
    beef: "Beef",
    pork: "Pork",
    dairy: "Dairy products",
    milk: "Milk",
    wheat: "Wheat",
    grain: "Grain-heavy treats",
    salmon: "Salmon",
    egg: "Egg",
  };

  const baseAvoid = allergies.map((item) => {
    const key = String(item).toLowerCase();
    return foodMap[key] || String(item).trim();
  });

  const issueAvoid = [];

  healthIssues.forEach((issue) => {
    const lower = String(issue).toLowerCase();

    if (lower.includes("sensitive stomach")) issueAvoid.push("Fatty or heavily seasoned food");
    if (lower.includes("kidney")) issueAvoid.push("High-sodium food");
    if (lower.includes("obesity")) issueAvoid.push("High-calorie treats");
    if (lower.includes("allergy")) issueAvoid.push("Common allergenic ingredients");
  });

  return uniqueStrings([...baseAvoid, ...issueAvoid]);
}

function buildRecommendedFoods(input, breed = null) {
  const recommended = [];

  if (input.lifeStage === "puppy") {
    recommended.push("Puppy-formula kibble", "Boiled egg", "Pumpkin", "Salmon");
  } else if (input.lifeStage === "senior") {
    recommended.push("Senior dog food", "White fish", "Pumpkin", "Sweet potato");
  } else {
    recommended.push("High-quality adult kibble", "Lean turkey", "Brown rice", "Sweet potato");
  }

  if (input.activityLevel === "high") {
    recommended.push("Protein-rich balanced meals");
  }

  if (String(input.climate || "").toLowerCase() === "hot") {
    recommended.push("Water-rich snacks");
  }

  if (breed?.energyLevel === "high") {
    recommended.push("High-protein balanced diet");
  }

  if (breed?.familyFriendly) {
    recommended.push("Balanced everyday nutrition");
  }

  return uniqueStrings(recommended);
}

function buildSupplementSuggestions(input, breed = null) {
  const suggestions = [];

  if (input.lifeStage === "puppy") {
    suggestions.push("Puppy DHA support if vet-approved");
  }

  if (input.lifeStage === "senior") {
    suggestions.push("Joint support supplements if vet-approved");
  }

  if (breed?.sheddingLevel === "high") {
    suggestions.push("Omega-3 support if vet-approved");
  }

  if (String(input.climate || "").toLowerCase() === "hot") {
    suggestions.push("Electrolyte support only if recommended by vet");
  }

  return uniqueStrings(suggestions);
}

function buildPortionGuidance(caloriesPerDay, mealsPerDay) {
  const perMeal = caloriesPerDay && mealsPerDay ? Math.round(caloriesPerDay / mealsPerDay) : 0;

  return perMeal
    ? `Aim for about ${perMeal} kcal per meal across ${mealsPerDay} meals per day, then adjust by body condition and vet guidance.`
    : "Portions should be adjusted based on calorie needs and body condition.";
}

function buildWarnings(input, breed = null) {
  const warnings = [];

  if (input.lifeStage === "puppy") {
    warnings.push("Use puppy-specific formula and avoid adult-only feeding plans.");
  }

  if (String(input.climate || "").toLowerCase() === "hot") {
    warnings.push("Increase water access and avoid overheating during outdoor activity.");
  }

  if ((input.healthIssues || []).length > 0) {
    warnings.push("Diet should be reviewed with a vet if the dog has existing health issues.");
  }

  if (breed?.apartmentFriendly === false && input.activityLevel === "low") {
    warnings.push("This breed may need more exercise to prevent weight gain.");
  }

  if ((input.allergies || []).length > 0) {
    warnings.push("Allergy-safe ingredients should be checked carefully before feeding.");
  }

  return uniqueStrings(warnings);
}

function buildNutritionBaseline(input, breed) {
  const mealsPerDay = getMealsPerDay(input.lifeStage, input.mealCountPreference);

  const caloriesPerDay = calculateCalories(input, breed);

  return {
    caloriesPerDay,
    mealsPerDay,
    recommendedFoods: buildRecommendedFoods(input, breed),
    avoidFoods: buildAvoidFoods(input.allergies, input.healthIssues),
    feedingSchedule: buildFeedingSchedule(mealsPerDay),
    hydrationTips: buildHydrationTips(input.climate),
    warningFlags: buildWarnings(input, breed),
    supplementSuggestions: buildSupplementSuggestions(input, breed),
    portionGuidance: buildPortionGuidance(caloriesPerDay, mealsPerDay),
  };
}

module.exports = {
  getMealsPerDay,
  buildHydrationTips,
  buildAvoidFoods,
  buildRecommendedFoods,
  buildSupplementSuggestions,
  buildPortionGuidance,
  buildWarnings,
  buildNutritionBaseline,
};