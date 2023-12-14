const express = require('express');
const router = express.Router();
const StatsController = require('../../controllers/stats')

router.post('/water-intake', StatsController.addWaterIntakeStats)

router.delete('/water-intake', StatsController.resetWaterIntakeState)

router.get('/statistics', StatsController.getTotalConsumptionStats);

module.exports = router;