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

router.post('/food-intake', DetailsController.saveFoodIntake);

router.put('/food-intake/:id', DetailsController.updateFoodIntake);

router.delete('/food-intake', DetailsController.deleteFoodIntake);

router.post('/water-intake', authenticate, validateBody(schemas.addWaterIntakeSchema), StatsController.addWaterIntakeStats)

router.delete('/water-intake', authenticate, StatsController.resetWaterIntakeStats)

router.get('/statistics', authenticate, StatsController.getTotalConsumptionStats);

module.exports = router;