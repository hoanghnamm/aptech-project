import http from "./axios";

/**
 * Fetch exactly the 3 latest dog-related news articles.
 * @returns {Promise<Array>} A promise that resolves to an array of articles.
 */
export const getLatestDogNews = async () => {
  const response = await http.get("/api/dog-news");
  return response.data?.data || response.data;
};
