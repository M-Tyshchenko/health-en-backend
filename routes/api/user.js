const express = require('express');
const router = express.Router();
const StatsController = require('../../controllers/stats')
const DetailsController = require('../../controllers/userDetails');
const { authenticate, validateBody } = require('../../middlewares')
const {schemas} = require('../schemas')

router.get('/current', DetailsController.getCurrentUser);

router.put('/update', DetailsController.updateUser);

router.put('/goal', DetailsController.updateGoal);

router.post('/weight', DetailsController.updateWeight);

router.post('/food-intake', authenticate, validateBody(schemas.addFoodIntakeSchema), StatsController.addFoodIntakeStats);

router.put('/food-intake/:id', authenticate, validateBody(schemas.updateFoodIntakeSchema), StatsController.updateFoodIntakeInfo);

router.delete('/food-intake', DetailsController.deleteFoodIntake);

router.post('/water-intake', authenticate, validateBody(schemas.addWaterIntakeSchema), StatsController.addWaterIntakeStats)

router.delete('/water-intake', authenticate, StatsController.resetWaterIntakeStats)

router.get('/statistics', authenticate, validateBody(schemas.getStatsSchema), StatsController.getTotalConsumptionStats);

module.exports = router;