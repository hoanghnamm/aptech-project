const Breed = require("../../models/Breed");
const groq = require("../../config/groq");
const { buildRecommendationMessages } = require("../../prompts/recommendation/breed-recommendation.prompt");

// Map a home size to the dog sizes that realistically fit
const HOME_SIZE_TO_SIZES = {
  apartment: ["toy", "small", "medium"],
  house_small: ["toy", "small", "medium", "large"],
  house_large: ["small", "medium", "large", "giant"],
};

// Call Groq in JSON-object mode (more forgiving than strict json_schema) and parse.
async function callRecommendationAI(messages) {
  const response = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
    messages,
    temperature: 0.3,
    max_tokens: 1200,
    response_format: { type: "json_object" },
  });
  const raw = response?.choices?.[0]?.message?.content || "{}";
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed?.recommendations) ? parsed.recommendations : [];
}

/**
 * Query candidate breeds from the DB based on hard preferences,
 * then ask the AI to rank the best 3-5 and explain why.
 */
async function recommendBreeds(input) {
  // 1. Build a DB query from the user's hard constraints
  const query = {};
  const sizes = HOME_SIZE_TO_SIZES[input.homeSize];
  if (sizes) query.size = { $in: sizes };
  if (input.homeSize === "apartment") query.apartmentFriendly = true;
  if (input.familyType === "family_kids") query.familyFriendly = true;
  if (input.activityLevel === "low") query.energyLevel = { $in: ["low", "medium"] };
  if (input.activityLevel === "high") query.energyLevel = { $in: ["medium", "high"] };

  let candidates = await Breed.find(query).limit(30).lean();

  // 2. If filters were too strict, fall back to a broader set
  if (candidates.length < 5) {
    candidates = await Breed.find(sizes ? { size: { $in: sizes } } : {})
      .limit(30)
      .lean();
  }
  if (candidates.length === 0) {
    candidates = await Breed.find({}).limit(30).lean();
  }

  const candidateMap = new Map(candidates.map((b) => [b.breedName.toLowerCase(), b]));

  // 3. Ask the AI to rank — fall back to a simple heuristic if it fails
  let aiList;
  try {
    const messages = buildRecommendationMessages({ input, candidates });
    aiList = await callRecommendationAI(messages);
  } catch (err) {
    console.error("Recommendation AI failed, using heuristic:", err.message);
    aiList = candidates.slice(0, 5).map((b) => ({
      breedName: b.breedName,
      matchScore: 70,
      reasons: ["Matched your home size and activity preferences."],
    }));
  }

  // 4. Enrich AI picks with the full breed details from the DB
  const recommendations = aiList
    .map((r) => {
      const details = candidateMap.get(String(r.breedName).toLowerCase());
      if (!details) return null;
      return {
        breedName: details.breedName,
        matchScore: Math.round(r.matchScore),
        reasons: Array.isArray(r.reasons) ? r.reasons : [],
        details,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.matchScore - a.matchScore);

  return {
    success: true,
    count: recommendations.length,
    candidatesConsidered: candidates.length,
    recommendations,
  };
}

module.exports = {
  recommendBreeds,
};
