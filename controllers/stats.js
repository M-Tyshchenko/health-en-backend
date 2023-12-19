const {
  ctrlWrapper,
  HTTPError,
  generateDailyConsumptionEntry,
  createNewStatsEntry,
  createFormattedDateString,
  parseAndTransformDate,
  generateMealEntry,
  createFoodIntakeQuery,
} = require("../helpers");
const { Stats } = require("../models");



const addWaterIntakeStats = async (req, res, next) => {
  const { _id: owner, weight } = req.user;

  const { waterIntake } = req.body;
  const date = createFormattedDateString();

  const isOwnerPresent = await Stats.findOne({ owner });

  if (!isOwnerPresent) {
    const dailyEntry = generateDailyConsumptionEntry({
      weight,
      waterIntake,
      date,
    }, generateMealEntry);
    const newEntry = createNewStatsEntry(dailyEntry, owner);
    const result = await Stats.create(newEntry);

    res.status(200).json({
      waterIntake: result.dates[result.dates.length - 1].stats.waterIntake,
    });
  }

  const isDailyCreated = await Stats.findOne({ owner, "dates.date": date });

  if (!isDailyCreated) {
    const dailyEntry = generateDailyConsumptionEntry({ waterIntake, date }, generateMealEntry);
    const result = await Stats.findOneAndUpdate(
      { owner },
      { $push: { dates: dailyEntry } },
      { new: true }
    );
    res.status(200).json({
      waterIntake: result.dates[result.dates.length - 1].stats.waterIntake,
    });
    return;
  }

  const result = await Stats.findOneAndUpdate(
    { owner, "dates.date": date },
    { $inc: { "dates.$.stats.waterIntake": waterIntake } },
    { new: true, runValidators: true }
  );
  res.status(200).json({
    waterIntake: result.dates[result.dates.length - 1].stats.waterIntake,
  });
};

const addFoodIntakeStats = async (req, res, next) => {
  const { _id: owner } = req.user;

  const {
    carbohidrates = null,
    protein = null,
    fat = null,
    dish = null,
    type = null,
  } = req.body;

  const date = createFormattedDateString();
  const isOwnerPresent = await Stats.findOne({ owner });

  if (!isOwnerPresent) {
    const dailyEntry = generateDailyConsumptionEntry(
      {
        carbohidrates,
        protein,
        fat,
        date,
        type,
        dish,
      },
      generateMealEntry
    );

    const newEntry = createNewStatsEntry(dailyEntry, owner);
    const result = await Stats.create(newEntry);
    res.status(200).json({
      foodIntake: result.dates[result.dates.length - 1].stats.foodIntake,
    });
    return;
  }
  const isDailyCreated = await Stats.findOne({ owner, "dates.date": date });

  if (!isDailyCreated) {
    const dailyEntry = generateDailyConsumptionEntry({
      carbohidrates,
      protein,
      fat,
      dish,
      date,
    });
    const result = await Stats.findOneAndUpdate(
      { owner },
      { $push: { dates: dailyEntry } },
      { new: true }
    );
    res.status(200).json({
      foodIntake: result.dates[result.dates.length - 1].stats.foodIntake,
    });
    return;
  }

  const isFoodIntakePresent =
    isDailyCreated.dates[isDailyCreated.dates.length - 1].stats.foodIntake[type]
      .length;

  if (!isFoodIntakePresent) {
    const mealEntry = generateMealEntry({ carbohidrates, protein, fat, dish });
    const query = `dates.$.stats.foodIntake.${type}`;
    const result = await Stats.findOneAndUpdate(
      { owner, "dates.date": date },
      { [query]: mealEntry },
      { new: true, runValidators: true }
    );

    res
      .status(200)
      .json({ result: result.dates[result.dates.length - 1].stats.foodIntake });
    return;
  }
  const mealEntry = generateMealEntry({ carbohidrates, protein, fat, dish });

  const query = createFoodIntakeQuery(type, mealEntry);

  const result = await Stats.findOneAndUpdate(
    { owner, "dates.date": date },
    query,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    result: result.dates[result.dates.length - 1].stats.foodIntake,
    message: "Food intake successfuly added",
  });
};

const updateFoodIntakeInfo = async (req, res, next) => {

};

const resetWaterIntakeStats = async (req, res, next) => {
  const { _id: owner } = req.user;
  const date = createFormattedDateString();
  const result = await Stats.findOneAndUpdate(
    { owner, "dates.date": date },
    { $set: { "dates.$.stats.waterIntake": 0 } },
    { new: true }
  );
  if (!result) {
    throw HTTPError(
      404,
      "Not found. User has no such records that may be reset on that date"
    );
  }
  res.status(200).json({
    message: "waterIntake has been successfuly reset",
    waterIntake: result.dates[result.dates.length - 1].stats.waterIntake,
  });
};

const getTotalConsumptionStats = async (req, res, next) => {

  const { _id: owner } = req.user;
  const { dateFrom, dateTo } = req.body;
  const validFromDate = parseAndTransformDate(
    dateFrom,
    createFormattedDateString
  );
  const validToDate = parseAndTransformDate(dateTo, createFormattedDateString);

  if (!validFromDate || !validToDate) {
    throw HTTPError(400, "Invalid date format");
  }
  const result = await Stats.find({
    owner,
    "dates.date": {
      $gte: validFromDate,
      $lte: validToDate,
    },
  });

  if (!result.length) {
    res.status(200).json({ message: "No records found within the given period" });
    return;
  }

  res.status(200).json(result[0].dates);
};

module.exports = {
  addWaterIntakeStats: ctrlWrapper(addWaterIntakeStats),
  resetWaterIntakeStats: ctrlWrapper(resetWaterIntakeStats),
  getTotalConsumptionStats: ctrlWrapper(getTotalConsumptionStats),
  addFoodIntakeStats: ctrlWrapper(addFoodIntakeStats),
  updateFoodIntakeInfo: ctrlWrapper(updateFoodIntakeInfo),
};
