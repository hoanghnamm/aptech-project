/**
 * Body Condition Score Service (B3)
 * Implements the veterinary 9-point BCS scale and calorie adjustments.
 */

const BCS_LABELS = {
  1: { label: "Emaciated", category: "underweight", calorieAdjust: 0.25 },
  2: { label: "Very Thin", category: "underweight", calorieAdjust: 0.20 },
  3: { label: "Thin", category: "underweight", calorieAdjust: 0.15 },
  4: { label: "Slightly Underweight", category: "healthy", calorieAdjust: 0.05 },
  5: { label: "Ideal", category: "healthy", calorieAdjust: 0 },
  6: { label: "Slightly Overweight", category: "overweight", calorieAdjust: -0.10 },
  7: { label: "Overweight", category: "overweight", calorieAdjust: -0.15 },
  8: { label: "Obese", category: "obese", calorieAdjust: -0.20 },
  9: { label: "Severely Obese", category: "obese", calorieAdjust: -0.30 },
};

/**
 * Get BCS metadata and calorie adjustment factor.
 * @param {number} score - Body Condition Score (1-9)
 * @returns {{ score, label, category, calorieAdjust }}
 */
function evaluateBCS(score) {
  const s = Math.round(Math.max(1, Math.min(9, Number(score) || 5)));
  const data = BCS_LABELS[s];
  return {
    score: s,
    label: data.label,
    category: data.category,
    calorieAdjust: data.calorieAdjust,
  };
}

/**
 * Evaluate weight status relative to breed ideal weight range.
 * @param {number} currentWeightKg
 * @param {{ min: number, max: number } | null} idealRange
 * @returns {{ status, deviationKg, deviationPercent, currentWeight, idealRange }}
 */
function evaluateWeightStatus(currentWeightKg, idealRange) {
  const weight = Number(currentWeightKg);
  if (!idealRange || !Number.isFinite(weight)) {
    return {
      status: "unknown",
      deviationKg: 0,
      deviationPercent: 0,
      currentWeight: weight || 0,
      idealRange: null,
    };
  }

  const idealMid = (idealRange.min + idealRange.max) / 2;
  let status = "healthy";
  let deviationKg = 0;

  if (weight < idealRange.min) {
    status = "underweight";
    deviationKg = weight - idealRange.min;
  } else if (weight > idealRange.max) {
    status = "overweight";
    deviationKg = weight - idealRange.max;
  }

  const deviationPercent = idealMid > 0
    ? Math.round(((weight - idealMid) / idealMid) * 100)
    : 0;

  return {
    status,
    deviationKg: Math.round(deviationKg * 10) / 10,
    deviationPercent,
    currentWeight: weight,
    idealRange,
  };
}

module.exports = {
  evaluateBCS,
  evaluateWeightStatus,
  BCS_LABELS,
};
