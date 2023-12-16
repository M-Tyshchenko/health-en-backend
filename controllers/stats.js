const {
  ctrlWrapper,
  HTTPError,
  generateDailyConsumptionEntry,
  createNewStatsEntry,
  createFormattedDateString,
  parseAndTransformDate,
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
    });
    const newEntry = createNewStatsEntry(dailyEntry, owner);
    const result = await Stats.create(newEntry);
    res.status(200).json({ result });
  }

  const isDailyCreated = await Stats.findOne({ owner, "dates.date": date });
  if (!isDailyCreated) {
    const dailyEntry = generateDailyConsumptionEntry({ waterIntake, date });
    const result = await Stats.findOneAndUpdate(
      { owner, "dates.date": date },
      { $push: { dailyEntry } }
    );
    res.status(200).json({ result });
  }

  const result = await Stats.findOneAndUpdate(
    { owner, "dates.date": date },
    { $inc: { "dates.$.stats.waterIntake": waterIntake } },
    { new: true, runValidators: true }
  );
  res.status(200).json(result);
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
  res.status(200).json({ result });
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
  if (!result) {
    throw HTTPError(404, "No records found within the given period");
  }

  res.status(200).json(result);
};

module.exports = {
  addWaterIntakeStats: ctrlWrapper(addWaterIntakeStats),
  resetWaterIntakeStats: ctrlWrapper(resetWaterIntakeStats),
  getTotalConsumptionStats: ctrlWrapper(getTotalConsumptionStats),
};

