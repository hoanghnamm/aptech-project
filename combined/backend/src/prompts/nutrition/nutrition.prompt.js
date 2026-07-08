/**
 * Nutrition AI Prompt — Enhanced (B4: Weekly Meal Plan)
 */

const buildNutritionMessages = ({ breed, input, baseEstimate, breedMatched }) => {
  const systemPrompt = `
You are PawIntel Nutrition Assistant — an expert canine nutritionist.

Rules:
- Only answer dog nutrition recommendation tasks.
- Do not provide veterinary diagnosis.
- Be practical, safe, and concise.
- Keep calories near the backend estimate (±15%).
- Do not contradict allergy restrictions.
- Use breed-specific knowledge when available.
- For the weekly meal plan, rotate protein sources for variety and nutritional balance.
- Return only valid JSON.
`;

  const healthRiskInfo = (breed.healthRisks || []).length > 0
    ? `- Health risks for breed: ${breed.healthRisks.join(", ")}`
    : "- No breed-specific health risks recorded";

  const breedNeedsInfo = (breed.breedSpecificNeeds || []).length > 0
    ? `- Breed-specific nutrition needs: ${breed.breedSpecificNeeds.join(", ")}`
    : "";

  const bcsInfo = input.bodyConditionScore
    ? `- Body Condition Score: ${input.bodyConditionScore}/9 (${baseEstimate.bodyConditionScore?.label || "N/A"})`
    : "- Body Condition Score: Not provided";

  const neuteredInfo = input.isNeutered
    ? "- Neutered/Spayed: Yes (calorie needs reduced ~15%)"
    : "- Neutered/Spayed: No";

  const weightStatusInfo = baseEstimate.weightStatus?.status !== "unknown"
    ? `- Weight status: ${baseEstimate.weightStatus?.status} (${baseEstimate.weightStatus?.deviationPercent > 0 ? "+" : ""}${baseEstimate.weightStatus?.deviationPercent}% from ideal)`
    : "- Weight status: Unknown (no breed weight range data)";

  const macroInfo = baseEstimate.macronutrients
    ? `- Target macros: Protein ${baseEstimate.macronutrients.protein.grams}g (${baseEstimate.macronutrients.protein.percent}%), Fat ${baseEstimate.macronutrients.fat.grams}g (${baseEstimate.macronutrients.fat.percent}%), Carb ${baseEstimate.macronutrients.carb.grams}g (${baseEstimate.macronutrients.carb.percent}%)`
    : "";

  const userPrompt = `
Breed matched in database: ${breedMatched ? "yes" : "no"}

Dog profile:
- Breed: ${breed.breedName}
- Origin: ${breed.origin || "Unknown"}
- Size: ${breed.size || input.size}
- Life stage: ${input.lifeStage}
- Age (months): ${input.ageMonths}
- Weight (kg): ${input.weightKg}
- Activity level: ${input.activityLevel}
- Goal: ${input.goal || "maintain"}
- Climate: ${input.climate || "not specified"}
- Allergies: ${(input.allergies || []).join(", ") || "none"}
- Health issues: ${(input.healthIssues || []).join(", ") || "none"}
${bcsInfo}
${neuteredInfo}
${weightStatusInfo}

Breed context:
${healthRiskInfo}
${breedNeedsInfo}
- Tendency to obesity: ${breed.tendencyToObesity || "unknown"}
- Energy level: ${breed.energyLevel || "medium"}
- Shedding level: ${breed.sheddingLevel || "medium"}

Backend baseline:
- Calories per day: ${baseEstimate.caloriesPerDay}
- Meals per day: ${baseEstimate.mealsPerDay}
${macroInfo}
- Recommended foods: ${(baseEstimate.recommendedFoods || []).join(", ")}
- Avoid foods: ${(baseEstimate.avoidFoods || []).join(", ")}
- Feeding schedule: ${(baseEstimate.feedingSchedule || []).join(", ")}
- Warning flags: ${(baseEstimate.warningFlags || []).join(", ") || "none"}
- Hydration tips: ${baseEstimate.hydrationTips || "Keep fresh water available at all times."}
- Portion guidance: ${baseEstimate.portionGuidance || "Adjust portions based on body condition."}
- Supplement suggestions: ${(baseEstimate.supplementSuggestions || []).join(", ") || "none"}

Task:
Generate a final nutrition recommendation for this dog.
Include a FULL 7-day weekly meal plan with breakfast, lunch (if applicable), and dinner.
You MUST provide exactly 7 elements in the weeklyMealPlan array, representing every single day: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, and Sunday. Do NOT omit the weekend.
Each meal should list specific food items with portion sizes in grams.
Return JSON only with these fields:
- caloriesPerDay
- mealsPerDay
- recommendedFoods
- avoidFoods
- feedingSchedule
- hydrationTips
- warningFlags
- confidence
- summary
- portionGuidance
- supplementSuggestions
- weeklyMealPlan (array of exactly 7 objects: day (e.g. "Monday"), meals array where each meal has: type, items array, portionGrams, calories)
`;

  return [
    { role: "system", content: systemPrompt.trim() },
    { role: "user", content: userPrompt.trim() },
  ];
};

module.exports = {
  buildNutritionMessages,
};