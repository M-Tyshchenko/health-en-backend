const User = require("../models/user");
const { calories, drink, elements } = require("../helpers/calculations");
const { authSchema } = require("../routes/schemas/auth");
const bcrypt = require("bcrypt");
const { createFormattedDateString } = require("../helpers");


async function getCurrentUser (req, res, next) {

    const id = req.user._id;
    try {
        const user = await User.findById(id).exec();
    
        res.status(200).send(user);
      } catch (err) {
        next(err);
      }
};

async function updateUser (req, res, next) {
    const id = req.user._id;
    const body = authSchema.validate(req.body);
    const userBody = body.value;

    if (typeof body.error !== "undefined") {
        return res.status(400).json({
        message: body.error.details.map((err) => err.message).join(", "),
        });
    }

    const { name, email, password, goal, gender, age, height, weight, activity, avatarURL } = req.body;
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

        const updatedUser = await User.findByIdAndUpdate(id, newUser, { new: true });

        res.status(200).json({
        user: { name: newUser.name, email: newUser.email },
        });
    
      } catch (err) {
        next(err);
      }
};

async function updateGoal (req, res, next) {
    const { goal } = req.body;
    const id = req.user._id;

    const user = await User.findById(id).exec();

    if (user.goal === goal) {
        return res.status(400).json({ "message": "goal not changed" });
    }

    const bmr = calories(user.gender, user.age, user.height, user.weight, user.activity);
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
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(id, newUser, { new: true });
        res.status(200).json({
            user: { goal: updatedUser.goal },
            });
    } catch(err) {
        next(err);
    }
    
};

async function updateWeight (req, res, next) {
    const date = createFormattedDateString();
    const { weight } = req.body;
    const id = req.user._id;

    const user = await User.findById(id).exec();

    if (user.weight === weight) {
        return res.status(400).json({ "message": "Weight not changed" });
    }

    const bmr = calories(user.gender, user.age, user.height, weight, user.activity);
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
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(id, newUser, { new: true });
        res.status(200).json({
            user: { weight: updatedUser.weight },
            });
    } catch(err) {
        next(err);
    }
};

async function saveFoodIntake (req, res, next) {
    res.status(200).json({ 'message': 'food is intaked' });
};

async function updateFoodIntake (req, res, next) {
    const { id } = req.params;
    res.status(200).json({ 'message': `food intake ${id} updated` });
};

async function deleteFoodIntake (req, res, next) {
    res.status(200).json({ 'message': `food intake deleted` });
};

module.exports = { 
    getCurrentUser, 
    updateUser, 
    updateGoal,
    updateWeight, 
    saveFoodIntake,
    updateFoodIntake,
    deleteFoodIntake
};