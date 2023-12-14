const {ctrlWrapper} = require('../helpers')

const addWaterIntakeStats = async (req, res, next) => {
    
}
const resetWaterIntakeState = async (req, res, next) => {
    
}

const getTotalConsumptionStats = async (req, res, next) => {
    
}

module.exports = {
    addWaterIntakeStats: ctrlWrapper(addWaterIntakeStats),
    resetWaterIntakeState: ctrlWrapper(resetWaterIntakeState),
    getTotalConsumptionStats: ctrlWrapper(getTotalConsumptionStats),
}