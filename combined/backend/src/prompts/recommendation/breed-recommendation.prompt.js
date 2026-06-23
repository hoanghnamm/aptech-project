/**
 * Build the prompt for the AI breed-recommendation task.
 * The AI must ONLY choose from the candidate breeds we pass in (real DB breeds),
 * so it can never invent a breed that isn't in our encyclopedia.
 */
const buildRecommendationMessages = ({ input, candidates }) => {
  const systemPrompt = `
You are PawIntel Breed Match Advisor.

Rules:
- Recommend dog breeds that best fit the user's lifestyle.
- You MUST only choose breeds from the provided candidate list (exact names).
- Pick the best 3 to 5 matches, ordered best first.
- Give a matchScore from 0 to 100 and 1-3 short, concrete reasons per breed.
- Consider home size, activity level, family type, climate, experience and shedding tolerance.
- Return only valid JSON.
`;

  const candidateLines = candidates
    .map(
      (b) =>
        `- ${b.breedName} | size:${b.size} | energy:${b.energyLevel} | shedding:${b.sheddingLevel} | apartmentFriendly:${b.apartmentFriendly} | familyFriendly:${b.familyFriendly} | origin:${b.origin}`
    )
    .join("\n");

  const userPrompt = `
User preferences:
- Home size: ${input.homeSize}
- Activity level: ${input.activityLevel}
- Family type: ${input.familyType}
- Climate: ${input.climate || "not specified"}
- Owner experience: ${input.experience || "not specified"}
- Shedding tolerance: ${input.sheddingTolerance || "not specified"}

Candidate breeds (choose ONLY from these exact names):
${candidateLines}

Task:
Return JSON only in this shape:
{
  "recommendations": [
    { "breedName": "<exact name from candidates>", "matchScore": <0-100>, "reasons": ["...", "..."] }
  ]
}
Pick 3 to 5 breeds, best match first.
`;

  return [
    { role: "system", content: systemPrompt.trim() },
    { role: "user", content: userPrompt.trim() },
  ];
};

module.exports = {
  buildRecommendationMessages,
};
