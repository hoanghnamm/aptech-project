import http from "./axios";

export const recommendNutrition = async (payload) => {
  const response = await http.post("/api/nutrition/recommend", payload);
  return response.data;
};

/** Fetch nutrition history for the authenticated user. */
export const getNutritionHistory = async (limit = 10) => {
  const response = await http.get("/api/nutrition/history", { params: { limit } });
  return response.data?.data || response.data;
};