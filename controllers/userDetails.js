const User = require("../models/user");
const { calories, drink, elements } = require("../helpers/calculations");
const { updateSchema } = require("../routes/schemas/user");
const bcrypt = require("bcrypt");
const {
  generateDailyConsumptionEntry,
  createNewStatsEntry,
  createFormattedDateString,
  ctrlWrapper,
  HTTPError,
} = require("../helpers");
const { Stats } = require("../models");

const addWeightStats = async (req, weight) => {
  const { _id: owner } = req.user;

  const date = createFormattedDateString();

  const isOwnerPresent = await Stats.findOne({ owner });

  if (!isOwnerPresent) {
    const dailyEntry = generateDailyConsumptionEntry({
      weight,
      date,
    });
    const newEntry = createNewStatsEntry(dailyEntry, owner);
    await Stats.create(newEntry);

    return;
  }

  const dailyEntry = generateDailyConsumptionEntry({ weight, date });
  await Stats.findOneAndUpdate({ owner }, { dates: dailyEntry }, { new: true });
};

async function getCurrentUser(req, res, next) {
  const id = req.user._id;
  try {
    const user = await User.findById(id).exec();

    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  console.log(req.file);
  const id = req.user._id;
  const body = authSchema.validate(req.body);

  if (typeof body.error !== "undefined") {
    return res.status(400).json({
      message: body.error.details.map((err) => err.message).join(", "),
    });
  }

  const {
    name,
    email,
    password,
    goal,
    gender,
    age,
    height,
    weight,
    activity,
    avatarURL,
  } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);
  const bmr = calories(gender, age, height, weight, activity);
  const water = drink(weight, activity);
  const nutrients = elements(goal, bmr);

  const newUser = {
    name,
    email,
    password: hashPassword,
    avatarURL,
    goal,
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
      user: { name: updatedUser.name, email: updatedUser.email },
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

  const bmr = calories(
    user.gender,
    user.age,
    user.height,
    user.weight,
    user.activity
  );
  const water = drink(user.weight, user.activity);
  const nutrients = elements(goal, bmr);

  const newUser = {
    goal,
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

async function saveFoodIntake(req, res, next) {
  res.status(200).json({ message: "food is intaked" });
}

async function updateFoodIntake(req, res, next) {
  const { id } = req.params;
  res.status(200).json({ message: `food intake ${id} updated` });
}

async function deleteFoodIntake(req, res, next) {
  res.status(200).json({ message: `food intake deleted` });
}

async function updateAvatar(req, res) {
  const { _id } = req.user;

  if (req.file === undefined) {
    throw HTTPError(400, "Image is undefined");
  }
  const avatarURL = req.file.path;

  await User.findByIdAndUpdate(_id, { avatarURL }, { new: true }).exec();
  res.status(200).json({ avatarURL, message: "User's avatar updated" });
}

module.exports = {
  getCurrentUser,
  updateUser,
  updateGoal,
  updateWeight,
  saveFoodIntake,
  updateFoodIntake,
  deleteFoodIntake,
  updateAvatar: ctrlWrapper(updateAvatar),
};
