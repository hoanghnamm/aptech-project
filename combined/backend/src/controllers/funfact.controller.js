const FunFact = require("../models/FunFact");

exports.getRandomFunFact = async (req, res, next) => {
  try {
    const { category } = req.query;

    let matchStage = {};
    if (category) {
      matchStage.category = category;
    }

    // Use aggregation framework to get a random document
    const randomFact = await FunFact.aggregate([
      { $match: matchStage },
      { $sample: { size: 1 } }
    ]);

    if (!randomFact || randomFact.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No fun facts found in the database.",
      });
    }

    res.status(200).json({
      success: true,
      data: randomFact[0]
    });
  } catch (error) {
    console.error("Error fetching random fun fact:", error);
    next(error);
  }
};
