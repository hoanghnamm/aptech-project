/**
 * Build the prompt that turns a natural-language search query into structured
 * filters that map onto the Breed database fields.
 */
const buildSearchMessages = (query) => {
  const systemPrompt = `
You convert a user's natural-language dog search into structured filters.

Available fields and allowed values (use ONLY these):
- size: "toy" | "small" | "medium" | "large" | "giant"
- energyLevel: "low" | "medium" | "high"
- sheddingLevel: "low" | "medium" | "high"
- familyFriendly: true | false
- apartmentFriendly: true | false
- keywords: array of temperament words (e.g. "Friendly", "Active", "Intelligent", "Protective", "Gentle", "Calm")

Rules:
- Only include a field if the query clearly implies it. Omit everything else.
- "for kids" / "for families" => familyFriendly: true
- "apartment" / "small space" => apartmentFriendly: true
- "low shedding" / "hypoallergenic" => sheddingLevel: "low"
- "active" / "energetic" / "for running" => energyLevel: "high"
- "calm" / "lazy" / "low energy" => energyLevel: "low"
- "small dogs" => size: "small"; "big dogs" => size: "large"
- "guard" / "protective" => keywords: ["Protective"]
- Return only valid JSON.
`;

  const userPrompt = `
User query: "${query}"

Return JSON only in this shape (include only the fields that apply):
{
  "filters": {
    "size": "...",
    "energyLevel": "...",
    "sheddingLevel": "...",
    "familyFriendly": true,
    "apartmentFriendly": true
  },
  "keywords": ["..."]
}
`;

  return [
    { role: "system", content: systemPrompt.trim() },
    { role: "user", content: userPrompt.trim() },
  ];
};

module.exports = {
  buildSearchMessages,
};
