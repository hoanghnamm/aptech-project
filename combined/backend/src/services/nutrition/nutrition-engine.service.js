/**
 * Nutrition Engine Service — Full Upgrade (B1-B6)
 * Integrates: breed adapter, BCS, health risks, macronutrients, neutered factor
 */

const { calculateCalories } = require("../../utils/calculateCalories");
const { buildFeedingSchedule } = require("./feeding-schedule.service");
const { evaluateBCS, evaluateWeightStatus } = require("./bcs.service");
const { processHealthRisks } = require("./health-risk-engine");
const { calculateMacronutrients } = require("./macronutrient.service");

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const uniqueStrings = (arr = []) =>
  [...new Set(arr.filter(Boolean).map((item) => String(item).trim()))];

function getMealsPerDay(lifeStage, mealCountPreference = null, forceMeals = null) {
  // Health risk override (e.g., bloat requires ≥3 meals)
  if (forceMeals) {
    const forced = Math.max(forceMeals, mealCountPreference || 0);
    return clamp(forced, 1, 6);
  }
  if (mealCountPreference) {
    return clamp(Number(mealCountPreference), 1, 6);
  }
  if (lifeStage === "puppy") return 3;
  if (lifeStage === "senior") return 2;
  return 2;
}

function buildHydrationTips(climate, breed = null) {
  const tips = [];
  const c = String(climate || "").toLowerCase();

  if (c === "hot") {
    tips.push("Increase water access, feed at cooler times, and avoid intense activity in hot weather.");
    tips.push("Add water-rich foods or ice cubes to meals during hot days.");
  } else if (c === "cold") {
    tips.push("Warm water may encourage drinking in cold weather. Monitor hydration levels.");
  } else {
    tips.push("Keep fresh water available all day and monitor water intake regularly.");
  }

  // Breed-specific hydration
  if (breed?.energyLevel === "high") {
    tips.push("Active breeds need more water — provide water during and after exercise.");
  }

  return tips.join(" ");
}

function buildAvoidFoods(allergies = [], healthIssues = [], healthRiskAvoid = []) {
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
    soy: "Soy",
    corn: "Corn",
    lamb: "Lamb",
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
    if (lower.includes("pancreatitis")) issueAvoid.push("High-fat foods");
    if (lower.includes("diabetes")) issueAvoid.push("Simple sugars and high-glycemic treats");
  });

  return uniqueStrings([...baseAvoid, ...issueAvoid, ...healthRiskAvoid]);
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
    recommended.push("Water-rich snacks (watermelon, cucumber)");
  }

  if (breed?.energyLevel === "high") {
    recommended.push("High-protein balanced diet");
  }

  // Size-specific
  if (breed?.size === "giant" || breed?.size === "large") {
    recommended.push("Joint-supporting foods (fish, sardines)");
  }
  if (breed?.size === "toy" || breed?.size === "small") {
    recommended.push("Small-bite kibble for easier chewing");
  }

  // BCS-based
  if (input.bodyConditionScore && input.bodyConditionScore >= 7) {
    recommended.push("Low-calorie vegetables (green beans, carrots)", "High-fiber foods");
  }
  if (input.bodyConditionScore && input.bodyConditionScore <= 3) {
    recommended.push("Calorie-dense quality protein", "Healthy fats (fish oil)");
  }

  return uniqueStrings(recommended);
}

function buildSupplementSuggestions(input, breed = null, healthRiskSupplements = []) {
  const suggestions = [];

  if (input.lifeStage === "puppy") {
    suggestions.push("Puppy DHA support if vet-approved");
  }

  if (input.lifeStage === "senior") {
    suggestions.push("Joint support supplements if vet-approved");
    suggestions.push("Antioxidant supplement for cognitive health");
  }

  if (breed?.sheddingLevel === "high") {
    suggestions.push("Omega-3 support if vet-approved");
  }

  if (String(input.climate || "").toLowerCase() === "hot") {
    suggestions.push("Electrolyte support only if recommended by vet");
  }

  // Neutered dogs may benefit from L-carnitine
  if (input.isNeutered) {
    suggestions.push("L-Carnitine for metabolism support (consult vet)");
  }

  return uniqueStrings([...suggestions, ...healthRiskSupplements]);
}

function buildPortionGuidance(caloriesPerDay, mealsPerDay, macros = null) {
  const perMeal = caloriesPerDay && mealsPerDay ? Math.round(caloriesPerDay / mealsPerDay) : 0;

  if (!perMeal) {
    return "Portions should be adjusted based on calorie needs and body condition.";
  }

  let guidance = `Aim for about ${perMeal} kcal per meal across ${mealsPerDay} meals per day.`;

  if (macros) {
    const proteinPerMeal = Math.round(macros.protein.grams / mealsPerDay);
    guidance += ` Each meal should contain approximately ${proteinPerMeal}g of protein.`;
  }

  guidance += " Adjust by body condition and vet guidance.";
  return guidance;
}

function buildWarnings(input, breed = null, healthRiskWarnings = []) {
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

  // BCS warnings
  if (input.bodyConditionScore) {
    const bcs = Number(input.bodyConditionScore);
    if (bcs >= 8) {
      warnings.push("⚠️ Body condition indicates obesity — calorie-restricted diet strongly recommended.");
    } else if (bcs >= 7) {
      warnings.push("Body condition indicates overweight — gradual calorie reduction recommended.");
    } else if (bcs <= 2) {
      warnings.push("⚠️ Body condition indicates severe underweight — increase calories and consult vet immediately.");
    } else if (bcs <= 3) {
      warnings.push("Body condition indicates underweight — increase calorie intake gradually.");
    }
  }

  // Neutered warning
  if (input.isNeutered) {
    warnings.push("Neutered/spayed dogs need fewer calories — portions adjusted automatically.");
  }

  return uniqueStrings([...warnings, ...healthRiskWarnings]);
}

/**
 * Main function: Build the complete nutrition baseline.
 */
function buildNutritionBaseline(input, breed) {
  // B3: Evaluate BCS
  const bcsResult = input.bodyConditionScore
    ? evaluateBCS(input.bodyConditionScore)
    : { score: 5, label: "Ideal", category: "healthy", calorieAdjust: 0 };

  // B3: Evaluate weight status
  const weightStatus = evaluateWeightStatus(input.weightKg, breed?.idealWeightRange || null);

  // B5: Process health risks
  const healthRiskResult = processHealthRisks(breed?.healthRisks || []);

  // Calculate meals (with health risk override for bloat etc.)
  const mealsPerDay = getMealsPerDay(
    input.lifeStage,
    input.mealCountPreference,
    healthRiskResult.forceMeals
  );

  // B3 + B5 + B6: Enhanced calorie calculation
  const caloriesPerDay = calculateCalories(input, breed, {
    isNeutered: input.isNeutered || false,
    bcsAdjust: bcsResult.calorieAdjust,
    healthCalorieAdjust: healthRiskResult.totalCalorieAdjust,
  });

  // B2: Calculate macronutrients
  const macronutrients = calculateMacronutrients(caloriesPerDay, breed?.nutritionProfile || null);

  return {
    caloriesPerDay,
    mealsPerDay,
    recommendedFoods: buildRecommendedFoods(input, breed),
    avoidFoods: buildAvoidFoods(input.allergies, input.healthIssues, healthRiskResult.avoidFoods),
    feedingSchedule: buildFeedingSchedule(mealsPerDay),
    hydrationTips: buildHydrationTips(input.climate, breed),
    warningFlags: buildWarnings(input, breed, healthRiskResult.warnings),
    supplementSuggestions: buildSupplementSuggestions(input, breed, healthRiskResult.supplements),
    portionGuidance: buildPortionGuidance(caloriesPerDay, mealsPerDay, macronutrients),
    // New fields from upgrades
    macronutrients,
    bodyConditionScore: bcsResult,
    weightStatus,
    healthAlerts: healthRiskResult.healthAlerts,
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