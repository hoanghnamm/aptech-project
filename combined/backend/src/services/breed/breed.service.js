const mongoose = require("mongoose");
const Breed = require("../../models/Breed");

/**
 * List breeds with optional text search + size filter + pagination.
 */
async function listBreeds({ search, size, page = 1, limit = 24 } = {}) {
  const query = {};

  if (search && search.trim()) {
    query.breedName = { $regex: search.trim(), $options: "i" };
  }
  if (size) {
    query.size = size;
  }

  const pageNum = Math.max(1, Number(page) || 1);
  const perPage = Math.min(100, Math.max(1, Number(limit) || 24));
  const skip = (pageNum - 1) * perPage;

  const [items, total] = await Promise.all([
    Breed.find(query).sort({ breedName: 1 }).skip(skip).limit(perPage).lean(),
    Breed.countDocuments(query),
  ]);

  return {
    items,
    total,
    page: pageNum,
    limit: perPage,
    totalPages: Math.ceil(total / perPage),
  };
}

/**
 * Fetch a single breed by Mongo ObjectId or by (case-insensitive) name.
 */
async function getBreed(idOrName) {
  if (mongoose.isValidObjectId(idOrName)) {
    const byId = await Breed.findById(idOrName).lean();
    if (byId) return byId;
  }
  return Breed.findOne({
    breedName: { $regex: `^${idOrName}$`, $options: "i" },
  }).lean();
}

module.exports = {
  listBreeds,
  getBreed,
};
