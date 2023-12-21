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

const addWaterIntakeStats = async (req, res) => {
  const { _id: owner, weight } = req.user;

  const { waterIntake } = req.body;
  const date = createFormattedDateString();

  const isOwnerPresent = await Stats.findOne({ owner });

  if (!isOwnerPresent) {
    const dailyEntry = generateDailyConsumptionEntry(
      {
        weight,
        waterIntake,
        date,
      },
      generateMealEntry
    );
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
    const dailyEntry = generateDailyConsumptionEntry(
      { waterIntake, date },
      generateMealEntry
    );
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
  const { _id: owner } = req.user;

  const {
    carbohidrates = null,
    protein = null,
    fat = null,
    dish = null,
    type = null,
    calories = null,
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
        calories,
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
    const mealEntry = generateMealEntry({
      carbohidrates,
      protein,
      fat,
      dish,
      calories,
    });
    const query = `dates.$.stats.foodIntake.${type}`;
    const result = await Stats.findOneAndUpdate(
      { owner, "dates.date": date },
      { [query]: mealEntry, $inc: { "dates.$.stats.totalCalories": calories } },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Food intake successfuly added",
      result: result.dates[result.dates.length - 1].stats.foodIntake,
      totalCalories: result.dates[result.dates.length - 1].stats.totalCalories,
    });
    return;
  }
  const mealEntry = generateMealEntry({
    carbohidrates,
    protein,
    fat,
    dish,
    calories,
  });

  const query = createFoodIntakeQuery(type, mealEntry, calories);

  const result = await Stats.findOneAndUpdate(
    { owner, "dates.date": date },
    query,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    result: result.dates[result.dates.length - 1].stats.foodIntake,
    message: "Food intake successfuly added",
    totalCalories: result.dates[result.dates.length - 1].stats.totalCalories,
  });
};

const updateFoodIntakeInfo = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const { type, dish, carbohidrates, protein, fat, calories } = req.body;

  const obj = await Stats.findOne({ owner });

  const x = [...obj.dates]
    .flatMap((d) => d.stats.foodIntake[type])
    .filter((u) => u._id.toString() === id);

  const { calories: prevValue } = x[0]._doc;
  const firstUpdateQuery = {
    $inc: {
      [`dates.$[dateElement].stats.totalCalories`]: -prevValue,
    },
  };
  const firstUpdateResult = await Stats.findOneAndUpdate(
    { owner, [`dates.stats.foodIntake.${type}._id`]: id },
    firstUpdateQuery,
    {
      new: true,
      arrayFilters: [{ [`dateElement.stats.foodIntake.${type}._id`]: id }],
    }
  );

  const updateQuery = {
    $set: {
      [`dates.$[dateElement].stats.foodIntake.${type}.$[foodIntakeElement].carbohidrates`]:
        carbohidrates,
      [`dates.$[dateElement].stats.foodIntake.${type}.$[foodIntakeElement].protein`]:
        protein,
      [`dates.$[dateElement].stats.foodIntake.${type}.$[foodIntakeElement].fat`]:
        fat,
      [`dates.$[dateElement].stats.foodIntake.${type}.$[foodIntakeElement].dish`]:
        dish,
      [`dates.$[dateElement].stats.foodIntake.${type}.$[foodIntakeElement].calories`]:
        calories,
    },

    $inc: {
      [`dates.$[dateElement].stats.totalCalories`]: calories,
    },
  };
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
    .json({
      message: "Update successful",
      data: transfomedResult[0],
      totalCalories: result.dates[0].stats.totalCalories,
    });
};

const resetFoodIntakeStats = async (req, res) => {
  const { _id: owner } = req.user;
  const { type } = req.body;
  const date = createFormattedDateString();

  const isPresent = await Stats.findOne({ owner, "dates.date": date });

  if (!isPresent) {
    res.status(200).json({ message: "No records match requested date" });
    return;
  }

  const updateQuery = {
    $unset: {
      [`dates.$[dateElement].stats.foodIntake.${type}`]: 1,
    },
    $set: {
      [`dates.$[dateElement].stats.totalCalories`]: 1,
    }
  };

  const arrayFilters = [{ "dateElement.date": date }];

  const result = await Stats.findOneAndUpdate(
    { owner, "dates.date": date },
    updateQuery,
    { new: true, arrayFilters }
  );
  res.status(200).json({
    message: `food intake stats for ${type} for today successfuly reset`,
    [type]: result.dates[result.dates.length - 1].stats.foodIntake[type],
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
    res
      .status(200)
      .json({ message: "No records found within the given period" });
    return;
  }

  res.status(200).json({ data: result[0].dates });
};

module.exports = {
  addWaterIntakeStats: ctrlWrapper(addWaterIntakeStats),
  resetWaterIntakeStats: ctrlWrapper(resetWaterIntakeStats),
  getTotalConsumptionStats: ctrlWrapper(getTotalConsumptionStats),
  addFoodIntakeStats: ctrlWrapper(addFoodIntakeStats),
  updateFoodIntakeInfo: ctrlWrapper(updateFoodIntakeInfo),
  resetFoodIntakeStats: ctrlWrapper(resetFoodIntakeStats),
};
