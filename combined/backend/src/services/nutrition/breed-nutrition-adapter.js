/**
 * Breed-Nutrition Adapter (B1)
 * Bridges the gap between Breed.js model schema and nutrition engine expected format.
 *
 * DB model uses:  lifestyleFilters.size, comparisonMetrics.energyLevel (1-5), healthRisks[], physicalStats.weight
 * Engine expects:  breed.size, breed.energyLevel ("low"/"medium"/"high"), breed.nutritionProfile, breed.sheddingLevel
 */

const ENERGY_MAP = {
  1: "low",
  2: "low",
  3: "medium",
  4: "high",
  5: "high",
};

function numericEnergyToText(val) {
  const num = Number(val);
  if (!Number.isFinite(num)) {
    const str = String(val || "").toLowerCase();
    if (["low", "medium", "high"].includes(str)) return str;
    return "medium";
  }
  return ENERGY_MAP[Math.round(Math.max(1, Math.min(5, num)))] || "medium";
}

/**
 * Parse weight strings like "25-34 kg", "10-15 lbs", "20 kg" etc.
 * Returns { min, max } in kg.
 */
function parseWeightRange(weightStr) {
  if (!weightStr || typeof weightStr !== "string") return null;

  const clean = weightStr.toLowerCase().replace(/lbs?/g, "").replace(/kgs?/g, "").replace(/pounds?/g, "").trim();

  // "25-34" or "25 - 34"
  const rangeMatch = clean.match(/(\d+\.?\d*)\s*[-–—to]+\s*(\d+\.?\d*)/);
  if (rangeMatch) {
    let min = parseFloat(rangeMatch[1]);
    let max = parseFloat(rangeMatch[2]);
    // If original had "lbs", convert
    if (weightStr.toLowerCase().includes("lb")) {
      min = Math.round(min * 0.453592 * 10) / 10;
      max = Math.round(max * 0.453592 * 10) / 10;
    }
    return { min, max };
  }

  // Single number "20"
  const singleMatch = clean.match(/(\d+\.?\d*)/);
  if (singleMatch) {
    let val = parseFloat(singleMatch[1]);
    if (weightStr.toLowerCase().includes("lb")) {
      val = Math.round(val * 0.453592 * 10) / 10;
    }
    return { min: Math.round(val * 0.85 * 10) / 10, max: Math.round(val * 1.15 * 10) / 10 };
  }

  return null;
}

/**
 * Determine breed-specific macronutrient requirements based on breed characteristics.
 */
function buildNutritionProfile(breed) {
  // If breed already has a nutritionProfile (from seed data), use it as base
  if (breed.nutritionProfile && breed.nutritionProfile.caloriesPerKg) {
    const np = breed.nutritionProfile;
    return {
      caloriesPerKg: np.caloriesPerKg || 35,
      proteinRequirement: np.proteinRequirement || "medium",
      fatRequirement: np.fatRequirement || "medium",
      carbRequirement: np.carbRequirement || "medium",
      proteinPercent: macroTextToPercent("protein", np.proteinRequirement),
      fatPercent: macroTextToPercent("fat", np.fatRequirement),
      carbPercent: macroTextToPercent("carb", np.carbRequirement),
      fiberPercent: { min: 3, max: 5 },
    };
  }

  // Build from DB fields
  const energyText = numericEnergyToText(
    breed.comparisonMetrics?.energyLevel ?? breed.energyLevel
  );
  const size = (breed.lifestyleFilters?.size || breed.size || "medium").toLowerCase();

  let caloriesPerKg = 35;
  let proteinReq = "medium";
  let fatReq = "medium";
  let carbReq = "medium";

  if (energyText === "high") {
    caloriesPerKg = 38;
    proteinReq = "high";
    fatReq = "high";
  } else if (energyText === "low") {
    caloriesPerKg = 32;
    carbReq = "low";
  }

  if (size === "giant") {
    caloriesPerKg = Math.max(caloriesPerKg, 40);
    proteinReq = "high";
  } else if (size === "toy" || size === "small") {
    caloriesPerKg = Math.min(caloriesPerKg, 33);
  }

  return {
    caloriesPerKg,
    proteinRequirement: proteinReq,
    fatRequirement: fatReq,
    carbRequirement: carbReq,
    proteinPercent: macroTextToPercent("protein", proteinReq),
    fatPercent: macroTextToPercent("fat", fatReq),
    carbPercent: macroTextToPercent("carb", carbReq),
    fiberPercent: { min: 3, max: 5 },
  };
}

function macroTextToPercent(type, level) {
  const ranges = {
    protein: { low: { min: 18, max: 22 }, medium: { min: 22, max: 26 }, high: { min: 26, max: 32 } },
    fat:     { low: { min: 8, max: 12 }, medium: { min: 12, max: 18 }, high: { min: 18, max: 25 } },
    carb:    { low: { min: 35, max: 45 }, medium: { min: 45, max: 55 }, high: { min: 50, max: 60 } },
  };
  const lvl = String(level || "medium").toLowerCase();
  return ranges[type]?.[lvl] || ranges[type]?.medium || { min: 20, max: 30 };
}

/**
 * Main adapter: Convert any breed document (DB model or seed format) into
 * a unified nutrition context object.
 */
function adaptBreedForNutrition(rawBreed) {
  if (!rawBreed) return null;

  const name = rawBreed.name || rawBreed.breedName || "Unknown Breed";
  const breedName = rawBreed.breedName || rawBreed.name || "Unknown Breed";

  // Size — prefer DB model field, fallback to seed field
  const size = (rawBreed.lifestyleFilters?.size || rawBreed.size || "medium").toLowerCase();

  // Energy level — handle both numeric (DB) and string (seed)
  const energyLevel = numericEnergyToText(
    rawBreed.comparisonMetrics?.energyLevel ?? rawBreed.energyLevel
  );

  // Shedding level
  const sheddingLevel = (rawBreed.lifestyleFilters?.sheddingLevel || rawBreed.sheddingLevel || "medium").toLowerCase();

  // Life expectancy
  const lifeExpectancy = rawBreed.physicalStats?.lifespan || rawBreed.lifeExpectancy || "Unknown";

  // Origin
  const origin = rawBreed.origin || "Unknown";

  // Weight range from physicalStats
  const idealWeightRange = parseWeightRange(rawBreed.physicalStats?.weight || rawBreed.weight);

  // Health risks
  const healthRisks = rawBreed.healthRisks || [];

  // Temperament / core traits
  const temperament = rawBreed.coreTraits || rawBreed.temperament || [];

  // Family/apartment friendly — handle both boolean and numeric
  const familyFriendly = rawBreed.familyFriendly ??
    (rawBreed.comparisonMetrics?.kidFriendly >= 3);
  const apartmentFriendly = rawBreed.apartmentFriendly ??
    (rawBreed.comparisonMetrics?.apartmentFriendly >= 3);

  // Obesity tendency from vulnerabilityToDisease or healthRisks
  const tendencyToObesity = determineTendencyToObesity(rawBreed);

  // Breed-specific needs from healthRisks
  const breedSpecificNeeds = deriveBreedNeeds(healthRisks, size, energyLevel);

  // Common allergies for this breed (best-effort)
  const commonAllergies = deriveCommonAllergies(rawBreed);

  // Nutrition profile with actual percentages
  const nutritionProfile = buildNutritionProfile(rawBreed);

  // Thumbnail / visual
  const thumbnail = rawBreed.thumbnail ||
    rawBreed.visualArchives?.[0]?.url || null;

  // Description
  const description = rawBreed.description || "";

  // Care advice
  const careAdvice = rawBreed.careAdvice || [];

  return {
    _id: rawBreed._id,
    breedName,
    name,
    origin,
    size,
    energyLevel,
    sheddingLevel,
    lifeExpectancy,
    temperament,
    familyFriendly,
    apartmentFriendly,
    healthRisks,
    idealWeightRange,
    tendencyToObesity,
    breedSpecificNeeds,
    commonAllergies,
    nutritionProfile,
    thumbnail,
    description,
    careAdvice,
  };
}

function determineTendencyToObesity(breed) {
  const risks = (breed.healthRisks || []).map((r) => String(r).toLowerCase());
  const vuln = String(breed.lifestyleFilters?.vulnerabilityToDisease || "").toLowerCase();

  if (risks.some((r) => r.includes("obesity") || r.includes("weight gain"))) return "high";
  if (vuln.includes("high")) return "medium";

  // Breeds with low energy are more prone
  const energy = numericEnergyToText(
    breed.comparisonMetrics?.energyLevel ?? breed.energyLevel
  );
  if (energy === "low") return "medium";

  return "low";
}

function deriveBreedNeeds(healthRisks, size, energyLevel) {
  const needs = [];
  const risks = healthRisks.map((r) => String(r).toLowerCase());

  if (risks.some((r) => r.includes("hip") || r.includes("dysplasia") || r.includes("joint"))) {
    needs.push("Joint support (Glucosamine & Chondroitin)");
  }
  if (risks.some((r) => r.includes("skin") || r.includes("coat") || r.includes("derma"))) {
    needs.push("Skin & coat health (Omega-3 & Omega-6)");
  }
  if (risks.some((r) => r.includes("heart") || r.includes("cardiac"))) {
    needs.push("Heart health (Taurine, L-Carnitine)");
  }
  if (risks.some((r) => r.includes("eye") || r.includes("vision") || r.includes("cataracts"))) {
    needs.push("Eye health (Antioxidants, Vitamin A)");
  }
  if (risks.some((r) => r.includes("bloat") || r.includes("gdv"))) {
    needs.push("Anti-bloat feeding strategy");
  }
  if (risks.some((r) => r.includes("dental") || r.includes("teeth"))) {
    needs.push("Dental health support");
  }

  if (size === "giant" || size === "large") {
    if (!needs.some((n) => n.includes("Joint"))) {
      needs.push("Joint support (Glucosamine & Chondroitin)");
    }
  }

  if (energyLevel === "high") {
    needs.push("High-performance energy diet");
  }

  return [...new Set(needs)];
}

function deriveCommonAllergies(breed) {
  const risks = (breed.healthRisks || []).map((r) => String(r).toLowerCase());
  const allergies = [];

  if (risks.some((r) => r.includes("food allerg") || r.includes("food sensitiv"))) {
    allergies.push("chicken", "beef", "dairy", "wheat");
  }
  if (risks.some((r) => r.includes("skin allerg") || r.includes("atopic"))) {
    allergies.push("grain", "soy");
  }

  return [...new Set(allergies)];
}

module.exports = {
  adaptBreedForNutrition,
  parseWeightRange,
  numericEnergyToText,
  buildNutritionProfile,
  macroTextToPercent,
};
