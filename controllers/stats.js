const {ctrlWrapper} = require('../helpers')
const {Stats} = require('../models')
const {HTTPError} = require('../helpers')


const addWaterIntakeStats = async (req, res, next) => {
    
    const {_id: owner} = req.user;
    const {waterIntake, date} = req.body;
    const stats = await Stats.findOneAndUpdate({owner});
    

    if (!stats) {
        const result = await Stats.create({owner, $push: {dates: date}})
        res.status(200).json(result);
    }
    const isPresent = stats.dates.find(day => day.date === date);
    console.log(isPresent);
    // const stats = await Stats.findOneAndUpdate({owner}, {$push: {dates: {waterIntake: waterIntake}}}, {new: true});
    console.log(stats)
    res.status(200).json(stats);
}
const resetWaterIntakeStats = async (req, res, next) => {
    
}

const getTotalConsumptionStats = async (req, res, next) => {
    
}

module.exports = {
    addWaterIntakeStats: ctrlWrapper(addWaterIntakeStats),
    resetWaterIntakeStats: ctrlWrapper(resetWaterIntakeStats),
    getTotalConsumptionStats: ctrlWrapper(getTotalConsumptionStats),
}


// const requestBody = {
// waterIntake: 500,
// date: 'Fri Dec 15 2023'
// }

// date should be an instance of Date class, transformed to toDateString();