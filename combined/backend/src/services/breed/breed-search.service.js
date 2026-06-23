const Breed = require("../../models/Breed");
const groq = require("../../config/groq");
const { buildSearchMessages } = require("../../prompts/search/search.prompt");

const SIZES = ["toy", "small", "medium", "large", "giant"];
const LEVELS = ["low", "medium", "high"];

// Ask the AI to parse the query into filters (JSON-object mode, then parse).
async function parseQueryToFilters(query) {
  const response = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
    messages: buildSearchMessages(query),
    temperature: 0.1,
    max_tokens: 300,
    response_format: { type: "json_object" },
  });
  const raw = response?.choices?.[0]?.message?.content || "{}";
  const parsed = JSON.parse(raw);
  return {
    filters: parsed.filters && typeof parsed.filters === "object" ? parsed.filters : {},
    keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
  };
}

// Deterministic backup parser: catches obvious terms even if the LLM misses them.
function ruleBasedParse(query) {
  const s = query.toLowerCase();
  const filters = {};
  const keywords = [];

  if (/low.?shedding|hypoallergenic|doesn'?t shed|no shed/.test(s)) filters.sheddingLevel = "low";
  else if (/high.?shedding|sheds a lot/.test(s)) filters.sheddingLevel = "high";

  if (/apartment|small space|flat|condo/.test(s)) filters.apartmentFriendly = true;
  if (/kids|children|family|families|toddler/.test(s)) filters.familyFriendly = true;

  if (/\bgiant\b/.test(s)) filters.size = "giant";
  else if (/big dog|large dog|\blarge\b/.test(s)) filters.size = "large";
  else if (/small dog|small breed|tiny|\bsmall\b/.test(s)) filters.size = "small";

  if (/active|energetic|running|hyper|high energy|exercise/.test(s)) filters.energyLevel = "high";
  else if (/calm|lazy|low energy|relaxed|couch/.test(s)) filters.energyLevel = "low";

  if (/guard|protective|protect/.test(s)) keywords.push("Protective");
  if (/friendly/.test(s)) keywords.push("Friendly");
  if (/intelligent|smart|clever/.test(s)) keywords.push("Intelligent");
  if (/gentle/.test(s)) keywords.push("Gentle");

  return { filters, keywords };
}

// Merge rule-based + AI filters (rule-based as the base, AI fills any gaps).
function mergeInterpreted(rules, ai) {
  return {
    filters: { ...rules.filters, ...ai.filters },
    keywords: Array.from(new Set([...(rules.keywords || []), ...(ai.keywords || [])])),
  };
}

// Turn the parsed filters into a safe MongoDB query (ignoring anything invalid).
function buildMongoQuery({ filters, keywords }) {
  const q = {};
  if (SIZES.includes(filters.size)) q.size = filters.size;
  if (LEVELS.includes(filters.energyLevel)) q.energyLevel = filters.energyLevel;
  if (LEVELS.includes(filters.sheddingLevel)) q.sheddingLevel = filters.sheddingLevel;
  if (typeof filters.familyFriendly === "boolean") q.familyFriendly = filters.familyFriendly;
  if (typeof filters.apartmentFriendly === "boolean") q.apartmentFriendly = filters.apartmentFriendly;
  if (keywords.length > 0) {
    q.temperament = { $in: keywords.map((k) => new RegExp(k, "i")) };
  }
  return q;
}

/**
 * Smart, AI-powered natural-language breed search.
 * @param {string} query - e.g. "friendly low shedding dogs for apartments"
 */
async function smartSearch(query) {
  // Always start from the deterministic rule-based parse...
  const rules = ruleBasedParse(query);

  // ...then let the AI add anything it understood that the rules missed.
  let aiInterpreted = { filters: {}, keywords: [] };
  try {
    aiInterpreted = await parseQueryToFilters(query);
  } catch (err) {
    console.error("Smart search AI parse failed, using rules only:", err.message);
  }

  const interpreted = mergeInterpreted(rules, aiInterpreted);
  const mongoQuery = buildMongoQuery(interpreted);

  let items = [];
  if (Object.keys(mongoQuery).length > 0) {
    items = await Breed.find(mongoQuery).sort({ breedName: 1 }).limit(24).lean();
  }

  // Fallback: plain text search across name / temperament / description
  if (items.length === 0) {
    const rx = new RegExp(query.trim(), "i");
    items = await Breed.find({
      $or: [{ breedName: rx }, { description: rx }, { temperament: rx }],
    })
      .sort({ breedName: 1 })
      .limit(24)
      .lean();
  }

  return {
    success: true,
    query,
    interpreted,
    total: items.length,
    items,
  };
}

module.exports = {
  smartSearch,
};
