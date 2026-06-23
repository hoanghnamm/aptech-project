import http from "./axios";

export const recommendNutrition = async (payload) => {
  const response = await http.post("/api/nutrition/recommend", payload);
  return response.data;
};