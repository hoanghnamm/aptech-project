import http from "./axios";

/**
 * Get AI breed recommendations based on lifestyle preferences.
 * @param {object} prefs - { homeSize, activityLevel, familyType, climate?, experience?, sheddingTolerance? }
 */
export const recommendBreeds = async (prefs) => {
  const response = await http.post("/api/recommendation", prefs);
  return response.data?.data || response.data;
};
