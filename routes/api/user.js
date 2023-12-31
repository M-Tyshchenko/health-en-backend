const express = require("express");
const router = express.Router();

const StatsController = require("../../controllers/stats");
const DetailsController = require("../../controllers/userDetails");
const {
  authenticate,
  validateBody,
  upload,
  isValidId,
} = require("../../middlewares");
const { schemas } = require("../schemas");

router.get("/current", authenticate, DetailsController.getCurrentUser);

router.put("/update", authenticate, upload.single("avatar"), DetailsController.updateUser);

router.put("/goal", authenticate, DetailsController.updateGoal);

router.post("/weight", authenticate, DetailsController.updateWeight);

router.post(
  "/food-intake",
  authenticate,
  validateBody(schemas.foodIntakeSchema),
  StatsController.addFoodIntakeStats
);

router.put(
  "/food-intake/:id",
  isValidId,
  authenticate,
  validateBody(schemas.foodIntakeSchema),
  StatsController.updateFoodIntakeInfo
);

router.delete(
  "/food-intake/:id",
  isValidId,
  authenticate,
  StatsController.deleteFoodIntakeById
);
router.delete(
  "/food-intake",
  authenticate,
  validateBody(schemas.resetFoodIntakeSchema),
  StatsController.resetFoodIntakeStats
);

router.post(
  "/water-intake",
  authenticate,
  validateBody(schemas.addWaterIntakeSchema),
  StatsController.addWaterIntakeStats
);

router.delete(
  "/water-intake",
  authenticate,
  validateBody(schemas.resetFoodIntakeSchema),
  StatsController.resetWaterIntakeStats
);

router.get(
  "/statistics",
  authenticate,
  StatsController.getTotalConsumptionStats
);

module.exports = router;
