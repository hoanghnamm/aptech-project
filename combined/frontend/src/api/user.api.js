import http from "./axios";

/** Fetch user preferences (viewed breeds, search history, favorites). */
export const getPreferences = async () => {
  const response = await http.get("/api/user/preferences");
  return response.data?.data || response.data;
};

/** Record a breed view for the current user. */
export const recordBreedView = async ({ breedName, size, energyLevel }) => {
  const response = await http.post("/api/user/preferences/view", {
    breedName,
    size,
    energyLevel,
  });
  return response.data?.data || response.data;
};

/** Fetch breed recognition history for the current user. */
export const getRecognitionHistory = async (limit = 20) => {
  const response = await http.get("/api/user/recognition-history", {
    params: { limit },
  });
  return response.data?.data || response.data;
};
