const vetService = require("../services/vet/vet.service");
const { sendSuccess, sendError } = require("../utils/response");

// Default fallback location: central Hanoi (used if the user has no GPS).
const DEFAULT_LOCATION = { lat: 21.0285, lng: 105.8542 };

const nearby = async (req, res, next) => {
  try {
    let lat = parseFloat(req.query.lat);
    let lng = parseFloat(req.query.lng);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      lat = DEFAULT_LOCATION.lat;
      lng = DEFAULT_LOCATION.lng;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return sendError(res, "Invalid coordinates", 400);
    }

    const open24h = req.query.open24h === "true";
    const result = vetService.findNearbyClinics(lat, lng, { open24h });
    result.usedFallbackLocation =
      Number.isNaN(parseFloat(req.query.lat)) || Number.isNaN(parseFloat(req.query.lng));

    return sendSuccess(res, result, "Nearby clinics found");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  nearby,
};
