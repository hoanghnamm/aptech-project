const { identifyBreed } = require("../ai/breed-identification.service");

/**
 * Run the breed model on an image and turn the result into gallery TAGS.
 * Reuses the existing breed-identification pipeline (Python Keras model + DB).
 *
 * @param {Buffer} buffer - image bytes
 * @param {string} originalName
 * @returns {Promise<{breed:string|null, confidence:number|null, tags:string[]}>}
 */
async function generateTags(buffer, originalName) {
  let result;
  try {
    result = await identifyBreed(buffer, originalName);
  } catch (err) {
    // If the AI model is unreachable, still allow the upload with a generic tag
    return { breed: null, confidence: null, tags: ["#Dog", "#Untagged"] };
  }

  const top = result?.predictions?.[0];
  if (!result?.success || !top) {
    return { breed: null, confidence: null, tags: ["#Dog", "#Unrecognized"] };
  }

  const tags = new Set(["#Dog"]);
  const toTag = (s) => "#" + String(s).replace(/\s+/g, "");

  tags.add(toTag(top.breed));

  const d = top.details;
  if (d) {
    if (d.size) tags.add(toTag(d.size.charAt(0).toUpperCase() + d.size.slice(1)));
    if (d.energyLevel) tags.add(toTag(d.energyLevel + "Energy"));
    (d.temperament || []).slice(0, 2).forEach((t) => tags.add(toTag(t)));
  }

  return {
    breed: top.breed,
    confidence: top.confidencePercentage ?? null,
    tags: Array.from(tags),
  };
}

module.exports = {
  generateTags,
};
