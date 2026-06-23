const searchService = require("../services/breed/breed-search.service");
const { sendSuccess, sendError } = require("../utils/response");

const search = async (req, res, next) => {
  try {
    const query = (req.query.q || req.body.q || "").toString().trim();
    if (!query) {
      return sendError(res, "Search query 'q' is required", 400);
    }
    const result = await searchService.smartSearch(query);
    return sendSuccess(res, result, "Search completed");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  search,
};
