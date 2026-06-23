const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function calculateRER(weightKg) {
  const w = Number(weightKg);
  if (!Number.isFinite(w) || w <= 0) return 0;
  return 70 * Math.pow(w, 0.75);
}

function getSizeMultiplier(size) {
  const map = {
    toy: 0.95,
    small: 1.0,
    medium: 1.1,
    large: 1.2,
    giant: 1.3,
  };
  return map[size] || 1.1;
}

function getActivityMultiplier(activityLevel) {
  const map = {
    low: 0.9,
    medium: 1.15,
    high: 1.35,
  };
  return map[activityLevel] || 1.15;
}

function getLifeStageMultiplier(lifeStage) {
  const map = {
    puppy: 2.0,
    adult: 1.0,
    senior: 0.9,
  };
  return map[lifeStage] || 1.0;
}

function getGoalMultiplier(goal) {
  const map = {
    maintain: 1.0,
    gain: 1.1,
    lose: 0.9,
  };
  return map[goal] || 1.0;
}

function calculateCalories(input, breed = null) {
  const rer = calculateRER(input.weightKg);
  const breedCaloriesPerKg = breed?.nutritionProfile?.caloriesPerKg || 35;
  const breedFactor = breedCaloriesPerKg / 35;

  const calories =
    rer *
    getSizeMultiplier(input.size) *
    getActivityMultiplier(input.activityLevel) *
    getLifeStageMultiplier(input.lifeStage) *
    getGoalMultiplier(input.goal) *
    breedFactor;

  return Math.round(clamp(calories, 150, 5000));
}

module.exports = {
  calculateRER,
  calculateCalories,
};