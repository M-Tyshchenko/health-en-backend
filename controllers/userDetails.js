const User = require("../models/user");
const { calories, drink, elements } = require("../helpers/calculations");
const { updateSchema } = require("../routes/schemas/user");

const {
  generateDailyConsumptionEntry,
  createNewStatsEntry,
  createFormattedDateString, generateMealEntry
} = require("../helpers");
const { Stats } = require("../models");

const addWeightStats = async (req, weight) => {
  const { _id: owner } = req.user;

  const date = createFormattedDateString();

  const isOwnerPresent = await Stats.findOne({ owner });

  if (!isOwnerPresent) {
    const dailyEntry = generateDailyConsumptionEntry(generateMealEntry, {
      weight,
      date,
    });
    const newEntry = createNewStatsEntry(dailyEntry, owner);
    await Stats.create(newEntry);

    return;
  }

  const dailyEntry = generateDailyConsumptionEntry(generateMealEntry, { weight, date });
  await Stats.findOneAndUpdate({ owner }, { dates: dailyEntry }, { new: true });
};

async function getCurrentUser(req, res) {
  const user = req.user;

  res.status(200).send({
    user,
  });
}

async function updateUser(req, res, next) {
  const id = req.user._id;
  const goal = req.user.goal;

  const body = updateSchema.validate(req.body);

  if (typeof body.error !== "undefined") {
    return res.status(400).json({
      message: body.error.details.map((err) => err.message).join(", "),
    });
  }

  const { name, gender, age, height, weight, activity } = req.body;

  const bmr = calories(gender, age, height, weight, activity);
  const water = drink(weight, activity);
  const nutrients = elements(goal, bmr);

  const newUser = {
    name,
    gender,
    age,
    height,
    weight,
    activity,
    bmr,
    water,
    nutrients: {
      protein: nutrients.protein,
      fat: nutrients.fat,
      carbonohidrates: nutrients.carbonohidrates,
    },
  };

  try {
    const updatedUser = await User.findByIdAndUpdate(id, newUser, {
      new: true,
    });

    res.status(200).json({
      user: {
        _id: updatedUser._id,
        name,
        email: updatedUser.email,
        goal,
        gender,
        age,
        height,
        weight,
        activity,
        avatarURL: updatedUser.avatarURL,
        bmr,
        water,
        nutrients,
        token: updatedUser.token,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function updateGoal(req, res, next) {
  const { goal } = req.body;
  const id = req.user._id;

  const user = await User.findById(id).exec();

  if (user.goal === goal) {
    return res.status(400).json({ message: "goal not changed" });
  }

  const nutrients = elements(goal, user.bmr);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        goal,
        nutrients: {
          protein: nutrients.protein,
          fat: nutrients.fat,
          carbonohidrates: nutrients.carbonohidrates,
        },
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      user: { goal: updatedUser.goal },
    });
  } catch (err) {
    next(err);
  }
}

async function updateWeight(req, res, next) {
  const { weight } = req.body;
  const id = req.user._id;

  const user = await User.findById(id).exec();

  if (user.weight === weight) {
    return res.status(400).json({ message: "Weight not changed" });
  }

  const bmr = calories(
    user.gender,
    user.age,
    user.height,
    weight,
    user.activity
  );
  const water = drink(weight, user.activity);
  const nutrients = elements(user.goal, bmr);

  const newUser = {
    weight,
    bmr,
    water,
    nutrients: {
      protein: nutrients.protein,
      fat: nutrients.fat,
      carbonohidrates: nutrients.carbonohidrates,
    },
  };

  try {
    const updatedUser = await User.findByIdAndUpdate(id, newUser, {
      new: true,
    });
    addWeightStats(req, weight);
    res.status(200).json({
      user: { weight: updatedUser.weight },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCurrentUser,
  updateUser,
  updateGoal,
  updateWeight,
};
