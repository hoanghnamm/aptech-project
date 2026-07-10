import api from "./axios";

/**
 * Fetch a random fun fact from the backend.
 * @param {string} category - Optional category (e.g., 'nutrition', 'behavior', 'vet')
 * @returns {Promise<Object>} The random fun fact object
 */
export const getRandomFunFact = async (category = "") => {
  try {
    const url = category ? `/api/funfacts/random?category=${category}` : "/api/funfacts/random";
    const response = await api.get(url);
    if (response.data && response.data.success) {
      return response.data.data;
    }
    return { content: "Debugging: Backend responded, but success is false or data is empty." };
  } catch (error) {
    console.error("Error fetching random fun fact:", error);
    return {
      content: "Debugging: Backend API call failed! Please check Network tab.",
      category: "error"
    };
  }
};
