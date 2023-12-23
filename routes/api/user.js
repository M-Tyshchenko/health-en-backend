const express = require("express");
const router = express.Router();

const StatsController = require("../../controllers/stats");
const DetailsController = require("../../controllers/userDetails");
const { authenticate, validateBody, upload, isValidId } = require("../../middlewares");
const { schemas } = require("../schemas");

router.get("/current", DetailsController.getCurrentUser);

router.put("/update", DetailsController.updateUser);

router.post(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  DetailsController.updateAvatar
);

router.put("/goal", DetailsController.updateGoal);

router.post("/weight", DetailsController.updateWeight);

router.post(
  "/food-intake",
  authenticate,
  validateBody(schemas.addFoodIntakeSchema),
  StatsController.addFoodIntakeStats
);

router.put(
  "/food-intake/:id",isValidId,
  authenticate, 
  validateBody(schemas.updateFoodIntakeSchema),
  StatsController.updateFoodIntakeInfo
);

router.delete("/food-intake/:id", isValidId, authenticate, StatsController.resetFoodIntakeStats);

router.post(
  "/water-intake",
  authenticate,
  validateBody(schemas.addWaterIntakeSchema),
  StatsController.addWaterIntakeStats
);

router.delete(
  "/water-intake",
  authenticate, validateBody(schemas.resetFoodIntakeSchema),
  StatsController.resetWaterIntakeStats
);

router.get(
  "/statistics",
  authenticate,
  StatsController.getTotalConsumptionStats
);

module.exports = router;
