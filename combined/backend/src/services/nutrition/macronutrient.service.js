/**
 * Macronutrient Calculator (B2)
 * Calculates actual gram amounts for protein, fat, carbs, and fiber
 * based on total daily calories and breed-specific percentage requirements.
 */

/**
 * Calculate macronutrients in grams from calories and percentage ranges.
 * @param {number} caloriesPerDay - Total daily calorie target
 * @param {object} nutritionProfile - Breed nutrition profile with percent ranges
 * @returns {{ protein, fat, carb, fiber }} each with { grams, percent, kcal }
 */
function calculateMacronutrients(caloriesPerDay, nutritionProfile) {
  if (!caloriesPerDay || caloriesPerDay <= 0) {
    return defaultMacros();
  }

  const proteinPct = nutritionProfile?.proteinPercent || { min: 22, max: 26 };
  const fatPct = nutritionProfile?.fatPercent || { min: 12, max: 18 };
  const fiberPct = nutritionProfile?.fiberPercent || { min: 3, max: 5 };

  // Use midpoint of ranges
  const proteinMid = (proteinPct.min + proteinPct.max) / 2;
  const fatMid = (fatPct.min + fatPct.max) / 2;
  const fiberMid = (fiberPct.min + fiberPct.max) / 2;

  // Remaining goes to carbs (ensure total = 100%)
  const carbMid = Math.max(0, 100 - proteinMid - fatMid - fiberMid);

  // Calorie conversion: 1g protein = 4 kcal, 1g fat = 9 kcal, 1g carb = 4 kcal, 1g fiber ≈ 0 kcal
  const proteinKcal = Math.round(caloriesPerDay * (proteinMid / 100));
  const fatKcal = Math.round(caloriesPerDay * (fatMid / 100));
  const fiberKcal = 0;
  const carbKcal = caloriesPerDay - proteinKcal - fatKcal;

  return {
    protein: {
      grams: Math.round(proteinKcal / 4),
      percent: Math.round(proteinMid),
      kcal: proteinKcal,
      range: proteinPct,
    },
    fat: {
      grams: Math.round(fatKcal / 9),
      percent: Math.round(fatMid),
      kcal: fatKcal,
      range: fatPct,
    },
    carb: {
      grams: Math.round(carbKcal / 4),
      percent: Math.round(carbMid),
      kcal: Math.max(0, carbKcal),
      range: { min: Math.round(carbMid - 5), max: Math.round(carbMid + 5) },
    },
    fiber: {
      grams: Math.round((caloriesPerDay * fiberMid) / 100 / 4),
      percent: Math.round(fiberMid),
      kcal: fiberKcal,
      range: fiberPct,
    },
  };
}

function defaultMacros() {
  return {
    protein: { grams: 0, percent: 24, kcal: 0, range: { min: 22, max: 26 } },
    fat: { grams: 0, percent: 15, kcal: 0, range: { min: 12, max: 18 } },
    carb: { grams: 0, percent: 57, kcal: 0, range: { min: 50, max: 60 } },
    fiber: { grams: 0, percent: 4, kcal: 0, range: { min: 3, max: 5 } },
  };
}

module.exports = {
  calculateMacronutrients,
};
