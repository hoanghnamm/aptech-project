/**
 * Health Risk Engine (B5)
 * Maps breed-specific health risks to nutrition adjustments, warnings, and supplements.
 */

const HEALTH_RISK_MAP = {
  "hip dysplasia": {
    severity: "high",
    supplements: ["Glucosamine & Chondroitin (vet-approved)", "Omega-3 fatty acids (fish oil)"],
    avoidFoods: [],
    nutritionTip: "Maintain lean body weight to reduce joint stress. Omega-3 helps reduce inflammation.",
    calorieAdjust: -0.05,
    warnings: ["Keep weight optimal to reduce hip/joint stress."],
  },
  "elbow dysplasia": {
    severity: "high",
    supplements: ["Glucosamine & Chondroitin (vet-approved)", "Omega-3 fatty acids"],
    avoidFoods: [],
    nutritionTip: "Joint-friendly nutrition with anti-inflammatory support.",
    calorieAdjust: -0.05,
    warnings: ["Avoid excess weight to protect elbow joints."],
  },
  "bloat": {
    severity: "critical",
    supplements: ["Probiotics for digestive health"],
    avoidFoods: ["Foods that cause gas", "Fermentable ingredients"],
    nutritionTip: "Feed 2-3 smaller meals instead of one large meal. No exercise 30 min after eating.",
    calorieAdjust: 0,
    warnings: [
      "CRITICAL: Feed smaller, more frequent meals to reduce bloat risk.",
      "Avoid vigorous exercise 30 minutes before and after meals.",
      "Use slow-feeder bowls to prevent gulping.",
    ],
    forceMeals: 3,
  },
  "gastric dilatation-volvulus": {
    severity: "critical",
    supplements: ["Probiotics for digestive health"],
    avoidFoods: ["Foods that cause gas"],
    nutritionTip: "Split meals into 2-3 portions. Elevated feeding bowls are controversial - consult your vet.",
    calorieAdjust: 0,
    warnings: ["CRITICAL: GDV risk — feed multiple small meals, avoid exercise after eating."],
    forceMeals: 3,
  },
  "obesity": {
    severity: "high",
    supplements: ["L-Carnitine (fat metabolism support)", "High-fiber supplement"],
    avoidFoods: ["High-calorie treats", "Table scraps", "Fatty meats"],
    nutritionTip: "Use measured portions, reduce treats to <10% of daily calories.",
    calorieAdjust: -0.15,
    warnings: ["This breed is prone to obesity. Monitor weight weekly and adjust portions."],
  },
  "weight gain": {
    severity: "medium",
    supplements: ["L-Carnitine"],
    avoidFoods: ["High-calorie treats"],
    nutritionTip: "Consistent portion control and regular exercise are key.",
    calorieAdjust: -0.10,
    warnings: ["Prone to weight gain — stick to measured portions."],
  },
  "heart disease": {
    severity: "high",
    supplements: ["Taurine", "L-Carnitine", "Omega-3 (EPA/DHA)"],
    avoidFoods: ["High-sodium foods", "Processed treats"],
    nutritionTip: "Low-sodium diet with adequate taurine. Grain-free diets may be linked to heart issues - consult vet.",
    calorieAdjust: 0,
    warnings: ["Heart condition risk — avoid high-sodium foods, ensure adequate taurine."],
  },
  "dilated cardiomyopathy": {
    severity: "high",
    supplements: ["Taurine", "L-Carnitine"],
    avoidFoods: ["High-sodium foods"],
    nutritionTip: "Ensure diet includes adequate taurine and L-carnitine.",
    calorieAdjust: 0,
    warnings: ["DCM risk — consult vet about taurine supplementation."],
  },
  "skin allergies": {
    severity: "medium",
    supplements: ["Omega-3 fatty acids (fish oil)", "Vitamin E"],
    avoidFoods: ["Common allergens (chicken, beef, dairy, wheat)"],
    nutritionTip: "Consider limited ingredient diet. Novel protein sources (venison, duck, rabbit) may help.",
    calorieAdjust: 0,
    warnings: ["Skin allergy prone — monitor for itching and consider elimination diet."],
  },
  "food allergies": {
    severity: "medium",
    supplements: ["Probiotics", "Omega-3"],
    avoidFoods: ["Common allergens (chicken, beef, dairy, wheat, soy)"],
    nutritionTip: "Use limited ingredient or hydrolyzed protein diet. Introduce new foods one at a time.",
    calorieAdjust: 0,
    warnings: ["Food allergy risk — introduce new ingredients gradually."],
  },
  "atopic dermatitis": {
    severity: "medium",
    supplements: ["Omega-3 fatty acids", "Vitamin E", "Probiotics"],
    avoidFoods: [],
    nutritionTip: "Anti-inflammatory diet rich in Omega-3 can help manage symptoms.",
    calorieAdjust: 0,
    warnings: ["Atopic dermatitis risk — omega-3 supplementation recommended."],
  },
  "diabetes": {
    severity: "high",
    supplements: ["Chromium (vet-prescribed)", "High-fiber supplement"],
    avoidFoods: ["Simple sugars", "High-glycemic treats", "White rice"],
    nutritionTip: "High-fiber, complex carbohydrate diet. Feed at consistent times.",
    calorieAdjust: -0.05,
    warnings: ["Diabetes risk — avoid high-sugar foods, maintain consistent feeding schedule."],
  },
  "hypothyroidism": {
    severity: "medium",
    supplements: ["Iodine-rich foods (kelp, in moderation)"],
    avoidFoods: ["Excessive soy (may interfere with thyroid)"],
    nutritionTip: "Monitor weight closely as hypothyroidism slows metabolism.",
    calorieAdjust: -0.10,
    warnings: ["Hypothyroidism risk — may need calorie reduction as metabolism slows."],
  },
  "kidney disease": {
    severity: "high",
    supplements: ["Omega-3 fatty acids", "B-vitamins"],
    avoidFoods: ["High-phosphorus foods", "Excessive protein", "High-sodium foods"],
    nutritionTip: "Moderate protein, low phosphorus diet. Keep well hydrated.",
    calorieAdjust: 0,
    warnings: ["Kidney disease risk — moderate protein, low phosphorus recommended."],
  },
  "pancreatitis": {
    severity: "high",
    supplements: ["Digestive enzymes (vet-approved)"],
    avoidFoods: ["High-fat foods", "Fatty meats", "Fried foods", "Table scraps"],
    nutritionTip: "Low-fat diet is essential. Avoid sudden diet changes.",
    calorieAdjust: 0,
    warnings: ["Pancreatitis risk — strictly low-fat diet required."],
  },
  "dental disease": {
    severity: "low",
    supplements: ["Dental chews (vet-approved)"],
    avoidFoods: [],
    nutritionTip: "Include dental-friendly kibble or approved dental chews.",
    calorieAdjust: 0,
    warnings: ["Dental issues common — consider dental chews and regular teeth cleaning."],
  },
  "eye problems": {
    severity: "low",
    supplements: ["Antioxidants (Vitamin A, Vitamin E, Lutein)"],
    avoidFoods: [],
    nutritionTip: "Antioxidant-rich diet supports eye health.",
    calorieAdjust: 0,
    warnings: [],
  },
  "cataracts": {
    severity: "medium",
    supplements: ["Antioxidants (Lutein, Vitamin C, Vitamin E)"],
    avoidFoods: [],
    nutritionTip: "Antioxidant-rich foods may slow cataract progression.",
    calorieAdjust: 0,
    warnings: ["Cataract risk — antioxidant supplementation recommended."],
  },
  "epilepsy": {
    severity: "medium",
    supplements: ["MCT oil (vet-prescribed)", "Omega-3"],
    avoidFoods: ["Artificial preservatives (BHA, BHT)", "Artificial colors"],
    nutritionTip: "Some evidence suggests MCT oil and ketogenic diets may help. Consult vet.",
    calorieAdjust: 0,
    warnings: ["Epilepsy risk — avoid artificial preservatives, consult vet about dietary management."],
  },
  "intervertebral disc disease": {
    severity: "high",
    supplements: ["Glucosamine & Chondroitin", "Omega-3"],
    avoidFoods: [],
    nutritionTip: "Maintain ideal weight to reduce spinal stress.",
    calorieAdjust: -0.05,
    warnings: ["IVDD risk — maintaining lean weight is critical for spinal health."],
  },
  "cancer": {
    severity: "high",
    supplements: ["Omega-3 (high EPA/DHA)", "Antioxidants"],
    avoidFoods: ["Excessive carbohydrates (cancer cells thrive on glucose)"],
    nutritionTip: "Higher protein and fat, moderate carbohydrate diet may be beneficial.",
    calorieAdjust: 0,
    warnings: ["Higher cancer risk — antioxidant-rich diet recommended."],
  },
};

/**
 * Process breed health risks and return aggregated nutrition adjustments.
 */
function processHealthRisks(healthRisks = []) {
  const result = {
    supplements: [],
    avoidFoods: [],
    warnings: [],
    healthAlerts: [],
    totalCalorieAdjust: 0,
    forceMeals: null,
  };

  if (!Array.isArray(healthRisks) || healthRisks.length === 0) {
    return result;
  }

  const seen = new Set();

  for (const risk of healthRisks) {
    const riskLower = String(risk).toLowerCase().trim();
    if (!riskLower || seen.has(riskLower)) continue;
    seen.add(riskLower);

    // Find matching risk mapping (partial match)
    let matched = null;
    for (const [key, mapping] of Object.entries(HEALTH_RISK_MAP)) {
      if (riskLower.includes(key) || key.includes(riskLower)) {
        matched = { key, ...mapping, originalRisk: risk };
        break;
      }
    }

    if (matched) {
      result.supplements.push(...(matched.supplements || []));
      result.avoidFoods.push(...(matched.avoidFoods || []));
      result.warnings.push(...(matched.warnings || []));
      result.totalCalorieAdjust += matched.calorieAdjust || 0;

      if (matched.forceMeals && (!result.forceMeals || matched.forceMeals > result.forceMeals)) {
        result.forceMeals = matched.forceMeals;
      }

      result.healthAlerts.push({
        risk: matched.originalRisk,
        severity: matched.severity,
        nutritionTip: matched.nutritionTip,
        supplements: matched.supplements || [],
      });
    } else {
      // Unknown risk — add generic alert
      result.healthAlerts.push({
        risk: risk,
        severity: "low",
        nutritionTip: "Consult your veterinarian for specific dietary recommendations.",
        supplements: [],
      });
    }
  }

  // Deduplicate
  result.supplements = [...new Set(result.supplements)];
  result.avoidFoods = [...new Set(result.avoidFoods)];
  result.warnings = [...new Set(result.warnings)];

  // Clamp total calorie adjustment
  result.totalCalorieAdjust = Math.max(-0.30, Math.min(0.10, result.totalCalorieAdjust));

  return result;
}

module.exports = {
  processHealthRisks,
  HEALTH_RISK_MAP,
};
