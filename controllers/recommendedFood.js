const RecommendedFood = require("../models/recommendedFood");

async function recommendedFood(req, res, next) {
  try {
    const food = await RecommendedFood.find().exec();

    res.json(food);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  recommendedFood,
};
