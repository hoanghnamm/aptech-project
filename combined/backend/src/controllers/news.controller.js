const newsService = require("../services/news/news.service");

/**
 * GET /api/dog-news
 * Returns exactly the 3 newest dog-related news articles as a JSON array.
 */
const getLatestDogNews = async (req, res, next) => {
  try {
    const articles = await newsService.getLatestDogNews();
    return res.json(articles);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLatestDogNews
};
