const buildNutritionMessages = ({ breed, input, baseEstimate, breedMatched }) => {
  const systemPrompt = `
You are PawIntel Nutrition Assistant.

Rules:
- Only answer dog nutrition recommendation tasks.
- Do not provide veterinary diagnosis.
- Be practical, safe, and concise.
- Keep calories near the backend estimate.
- Do not contradict allergy restrictions.
- Return only valid JSON.
`;

  const userPrompt = `
  Breed matched in database: ${breedMatched ? "yes" : "no"}

Dog profile:
- Breed: ${breed.breedName}
- Origin: ${breed.origin || "Unknown"}
- Size: ${input.size}
- Life stage: ${input.lifeStage}
- Age (months): ${input.ageMonths}
- Weight (kg): ${input.weightKg}
- Activity level: ${input.activityLevel}
- Goal: ${input.goal || "maintain"}
- Climate: ${input.climate || "not specified"}
- Allergies: ${(input.allergies || []).join(", ") || "none"}
- Health issues: ${(input.healthIssues || []).join(", ") || "none"}

Backend baseline:
- Calories per day: ${baseEstimate.caloriesPerDay}
- Meals per day: ${baseEstimate.mealsPerDay}
- Recommended foods: ${(baseEstimate.recommendedFoods || []).join(", ")}
- Avoid foods: ${(baseEstimate.avoidFoods || []).join(", ")}
- Feeding schedule: ${(baseEstimate.feedingSchedule || []).join(", ")}
- Warning flags: ${(baseEstimate.warningFlags || []).join(", ") || "none"}
- Hydration tips: ${baseEstimate.hydrationTips || "Keep fresh water available at all times."}
- Portion guidance: ${baseEstimate.portionGuidance || "Adjust portions based on body condition."}
- Supplement suggestions: ${(baseEstimate.supplementSuggestions || []).join(", ") || "none"}

Task:
Generate a final nutrition recommendation for this dog.
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
`;

  return [
    { role: "system", content: systemPrompt.trim() },
    { role: "user", content: userPrompt.trim() },
  ];
};

module.exports = {
  buildNutritionMessages,
};