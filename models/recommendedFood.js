const mongoose = require("mongoose");

const recommendedFoodSchema = new mongoose.Schema({
  name: String,

  amount: String,

  img: String,

  calories: Number,

  nutrition: {
    carbohydrates: Number,
    protein: Number,
    fat: Number,
  },
});

module.exports = mongoose.model("RecommendedFood", recommendedFoodSchema);
