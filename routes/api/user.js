const express = require('express');
const router = express.Router();
const StatsController = require('../../controllers/stats')
const DetailsController = require('../../controllers/userDetails');
const {authenticate} = require('../../middlewares')

router.get('/current', DetailsController.getCurrentUser);

router.put('/update', DetailsController.updateUser);

router.put('/goal', DetailsController.updateGoal);

router.post('/weight', DetailsController.updateWeight);

router.post('/food-intake', DetailsController.saveFoodIntake);

router.put('/food-intake/:id', DetailsController.updateFoodIntake);

router.delete('/food-intake', DetailsController.deleteFoodIntake);

router.post('/water-intake', authenticate, StatsController.addWaterIntakeStats)

router.delete('/water-intake', StatsController.resetWaterIntakeStats)

router.get('/statistics', StatsController.getTotalConsumptionStats);

module.exports = router;