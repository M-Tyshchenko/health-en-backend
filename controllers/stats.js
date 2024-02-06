const {
  ctrlWrapper,
  HTTPError,
  generateDailyConsumptionEntry,
  createNewStatsEntry,
  createFormattedDateString,
  parseAndTransformDate,
  generateMealEntry,
  compileFoodIntakeSuccesResponse,
  createFoodIntakeQuery,
  createFirstFoodUpdateQuery,
  createFoodIntakeSecondUpdateQuery,
  createFoodIntakeQueryIfNotPresent,
  createDeleteFoodArrayQuery,
} = require("../helpers");
const { Stats } = require("../models");

const addWaterIntakeStats = async (req, res) => {
  const { _id: owner, weight } = req.user;

  const { waterIntake } = req.body;
  const date = createFormattedDateString();

  const isOwnerPresent = await Stats.findOne({ owner });

  if (!isOwnerPresent) {
    const dailyEntry = generateDailyConsumptionEntry(generateMealEntry, {
      weight,
      waterIntake,
      date,
    });
    const newEntry = createNewStatsEntry(dailyEntry, owner);
    const result = await Stats.create(newEntry);

    res.status(200).json({
      message: `water intake increased by ${waterIntake} ml`,
      waterIntake: result.dates[result.dates.length - 1].stats.waterIntake,
    });
    return;
  }

  const isDailyCreated = await Stats.findOne({ owner, "dates.date": date });

  if (!isDailyCreated) {
    const dailyEntry = generateDailyConsumptionEntry(generateMealEntry, {
      weight,
      waterIntake,
      date,
    });
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

const addFoodIntakeStats = async (req, res) => {
  const { _id: owner, weight } = req.user;

  const { type = null } = req.body;

  const date = createFormattedDateString();

  const isOwnerPresent = await Stats.findOne({ owner });

  if (!isOwnerPresent) {
    const dailyEntry = generateDailyConsumptionEntry(generateMealEntry, {
      weight,
      ...req.body,
      date,
    });

    const newEntry = createNewStatsEntry(dailyEntry, owner);
    const result = await Stats.create(newEntry);
    res.status(200).json(compileFoodIntakeSuccesResponse(result, "create"));
    return;
  }
  const isDailyCreated = await Stats.findOne({ owner, "dates.date": date });

  if (!isDailyCreated) {
    const dailyEntry = generateDailyConsumptionEntry(generateMealEntry, {
      weight,
      ...req.body,
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
    const mealEntry = generateMealEntry(req.body);
    const updateQuery = createFoodIntakeQueryIfNotPresent({
      ...req.body,
      mealEntry,
    });
    const result = await Stats.findOneAndUpdate(
      { owner, "dates.date": date },
      updateQuery,
      { new: true, runValidators: true }
    );
    res.status(200).json(compileFoodIntakeSuccesResponse(result, "create"));
    return;
  }
  const mealEntry = generateMealEntry(req.body);

  const query = createFoodIntakeQuery({ ...req.body, mealEntry });

  const result = await Stats.findOneAndUpdate(
    { owner, "dates.date": date },
    query,
    { new: true, runValidators: true }
  );

  res.status(200).json(compileFoodIntakeSuccesResponse(result, "create"));
};

const updateFoodIntakeInfo = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const { type } = req.body;

  const obj = await Stats.findOne({ owner });

  const x = [...obj.dates]
    .flatMap((d) => d.stats.foodIntake[type])
    .filter((u) => u._id.toString() === id);

  const firstUpdateQuery = createFirstFoodUpdateQuery(x[0]._doc);

  await Stats.findOneAndUpdate(
    { owner, [`dates.stats.foodIntake.${type}._id`]: id },
    firstUpdateQuery,
    {
      new: true,
      arrayFilters: [{ [`dateElement.stats.foodIntake.${type}._id`]: id }],
    }
  );

  const updateQuery = createFoodIntakeSecondUpdateQuery(req.body);

  const arrayFilters = [
    { [`dateElement.stats.foodIntake.${type}._id`]: id },
    { "foodIntakeElement._id": id },
  ];

  const result = await Stats.findOneAndUpdate(
    { owner, [`dates.stats.foodIntake.${type}._id`]: id },
    updateQuery,
    {
      new: true,
      arrayFilters,
      projection: {
        dates: {
          $elemMatch: {
            [`stats.foodIntake.${type}`]: {
              $elemMatch: {
                _id: id,
              },
            },
          },
        },
      },
    }
  );

  if (!result) {
    res.status(200).json({ message: "no results found" });
  }

  const transfomedResult = result.dates[0].stats.foodIntake[type].filter(
    (unit) => unit._id.toString() === id
  );
  res
    .status(200)
    .json(compileFoodIntakeSuccesResponse(result, "update", transfomedResult));
};

const deleteFoodIntakeById = async (req, res) => {
  const { _id: owner } = req.user;
  const { type } = req.query;
  const { id } = req.params;

  const date = createFormattedDateString();

  const result = await Stats.findOne({ owner, "dates.date": date });
  if (!result) {
    throw HTTPError(404);
  }
  const data = result.dates.filter((d) => d.date === date);
  if (!data[0].stats.foodIntake[type].length) {
    res.status(200).json({ message: `No records in ${type} per today` });
    return;
  }
  const [{ stats }] = data;

  const totalValues = stats.foodIntake[type].reduce(
    (acc, el) => {
      acc.carbohidrates += el.carbohidrates;
      acc.protein += el.protein;
      acc.fat += el.fat;
      acc.calories += el.calories;
      return acc;
    },
    {
      carbohidrates: 0,
      protein: 0,
      fat: 0,
      calories: 0,
    }
  );
  const query = createDeleteFoodArrayQuery(totalValues, type);

  await Stats.findOneAndUpdate({ owner, "dates.date": date }, query, {
    new: true,
  });

  res.status(200).json({
    message: `Food intake with id ${id} successfuly deleted`,
  });
};

const resetFoodIntakeStats = async (req, res) => {
  const { _id: owner } = req.user;
  const { type } = req.query;
  const date = createFormattedDateString();
  const result = await Stats.findOne({ owner, "dates.date": date });

  if (!result) {
    throw HTTPError(404);
  }
  const data = result.dates.filter((d) => d.date === date);

  if (!data[0].stats.foodIntake[type].length) {
    res.status(200).json({ message: `No records in ${type} per today` });
    return;
  }
  const [{ stats }] = data;
  const totalValues = stats.foodIntake[type].reduce(
    (acc, el) => {
      acc.carbohidrates += el.carbohidrates;
      acc.protein += el.protein;
      acc.fat += el.fat;
      acc.calories += el.calories;
      return acc;
    },
    {
      carbohidrates: 0,
      protein: 0,
      fat: 0,
      calories: 0,
    }
  );

  const query = createDeleteFoodArrayQuery(totalValues, type);

  const finalResult = await Stats.findOneAndUpdate(
    { owner, "dates.date": date },
    query,
    { new: true }
  );
  const transformedFinalResult = finalResult.dates.filter(
    (d) => d.date === date
  );

  res.status(200).json({
    message: `${type} records per today cleared`,
    data: transformedFinalResult[0],
  });
};

const resetWaterIntakeStats = async (req, res) => {
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

const getTotalConsumptionStats = async (req, res) => {
  const { _id: owner } = req.user;
  const { dateFrom, dateTo } = req.query;
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
    dates: {
      $elemMatch: {
        date: {
          $gte: validFromDate,
          $lte: validToDate,
        },
      },
    },
  });

  if (!result.length) {
    res.status(200).json({
      message: "No records found within the given period",
      stats: null,
    });
    return;
  }

  const transfomedResult = [...result[0].dates].filter(
    (day) => day.date >= dateFrom && day.date <= dateTo
  );
  const data =
    transfomedResult.length > 1 ? transfomedResult : transfomedResult[0];

  res.status(200).json(data);
};

module.exports = {
  addWaterIntakeStats: ctrlWrapper(addWaterIntakeStats),
  resetWaterIntakeStats: ctrlWrapper(resetWaterIntakeStats),
  getTotalConsumptionStats: ctrlWrapper(getTotalConsumptionStats),
  addFoodIntakeStats: ctrlWrapper(addFoodIntakeStats),
  updateFoodIntakeInfo: ctrlWrapper(updateFoodIntakeInfo),
  deleteFoodIntakeById: ctrlWrapper(deleteFoodIntakeById),
  resetFoodIntakeStats: ctrlWrapper(resetFoodIntakeStats),
};
