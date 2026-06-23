import http from "./axios";

/**
 * Natural-language smart search for dog breeds.
 * @param {string} q - e.g. "friendly low shedding dogs for apartments"
 */
export const smartSearch = async (q) => {
  const response = await http.get("/api/search", { params: { q } });
  return response.data?.data || response.data;
};
