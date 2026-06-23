function generateNutritionPrompt({ breed, input, baseEstimate }) {
  return {
    system: `
You are PawIntel Nutrition Assistant.
Only answer dog nutrition tasks.
Do not provide veterinary diagnosis.
Return only valid JSON.
`.trim(),

    user: `
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
Do not contradict allergy restrictions.
Return JSON only with:
caloriesPerDay, mealsPerDay, recommendedFoods, avoidFoods, feedingSchedule,
hydrationTips, warningFlags, confidence, summary, portionGuidance, supplementSuggestions
`.trim(),
  };
}

module.exports = generateNutritionPrompt;