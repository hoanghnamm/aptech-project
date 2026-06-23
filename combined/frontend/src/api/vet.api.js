import http from "./axios";

/**
 * Find nearby vet clinics for a location.
 * @param {number|null} lat
 * @param {number|null} lng
 * @param {boolean} open24h - only show 24/7 clinics
 */
export const getNearbyClinics = async (lat, lng, open24h = false) => {
  const params = {};
  if (lat != null && lng != null) {
    params.lat = lat;
    params.lng = lng;
  }
  if (open24h) params.open24h = true;
  const response = await http.get("/api/vet/nearby", { params });
  return response.data?.data || response.data;
};
