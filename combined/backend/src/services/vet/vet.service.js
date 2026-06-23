const clinics = require("../../data/clinics.json");

// Haversine formula: great-circle distance between two lat/lng points in km.
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in km
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Find clinics near a point, sorted by distance (closest first).
 * @param {number} lat
 * @param {number} lng
 * @param {object} opts - { open24h?: boolean, limit?: number }
 */
function findNearbyClinics(lat, lng, { open24h = false, limit = 10 } = {}) {
  let list = clinics.map((c) => ({
    ...c,
    distanceKm: Math.round(haversineKm(lat, lng, c.lat, c.lng) * 10) / 10,
  }));

  if (open24h) list = list.filter((c) => c.open24h);

  list.sort((a, b) => a.distanceKm - b.distanceKm);

  return {
    success: true,
    origin: { lat, lng },
    count: Math.min(list.length, limit),
    clinics: list.slice(0, limit),
  };
}

module.exports = {
  findNearbyClinics,
};
