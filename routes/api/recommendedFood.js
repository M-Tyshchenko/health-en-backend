const express = require("express");

const router = express.Router();

require("./db");

const RecommendedFoodController = require("../../controllers/recommendedFood");

router.get("/", RecommendedFoodController.recommendedFood);

module.exports = router;
