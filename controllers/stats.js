const { ctrlWrapper } = require("../helpers");
const { Stats } = require("../models");
const { HTTPError } = require("../helpers");

const generateDailyConsumptionEntry = (params) => {
  const {
    waterIntake = 0,
    foodIntake: { carbohidrates = 0, protein = 0, fat = 0 } = {},
    calories = 0,
    date,
  } = params;

  return {
    date,
    stats: {
      waterIntake,
      foodIntake: {
        carbohidrates,
        protein,
        fat,
      },
      calories,
    },
  };
};

const createNewStatsEntry = (dailyEntry, owner) => {
  return {
    dates: [dailyEntry],
    owner,
  };
};

const createDateString = () => {
  const x = new Date();
  const date = x.toDateString();
  return date;
};

const addWaterIntakeStats = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { waterIntake } = req.body;

  const date = createDateString();
  const isExist = await Stats.findOne({ owner, "dates.date": date });
  if (!isExist) {
    const dailyEntry = generateDailyConsumptionEntry({ waterIntake, date });
    const newEntry = createNewStatsEntry(dailyEntry, owner);
    const result = await Stats.create(newEntry);
    res.status(200).json({ result });
  }

 const  result = await Stats.findOneAndUpdate(
    { owner, "dates.date": date },
    { $inc: { "dates.$.stats.waterIntake": waterIntake } },
    { new: true }
  );
  res.status(200).json(result);
};
const resetWaterIntakeStats = async (req, res, next) => {};

const getTotalConsumptionStats = async (req, res, next) => {};

module.exports = {
  addWaterIntakeStats: ctrlWrapper(addWaterIntakeStats),
  resetWaterIntakeStats: ctrlWrapper(resetWaterIntakeStats),
  getTotalConsumptionStats: ctrlWrapper(getTotalConsumptionStats),
};

// const requestBody = {
// "waterIntake": 500
// }

