const joi = require("joi");
const { genders } = require("../../helpers/constants");

const addWaterIntakeSchema = joi.object({
  waterIntake: joi.number().required().max(7000).positive().min(0),
});

const foodIntakeSchema = joi.object({
  carbohidrates: joi.number().required().min(0),
  protein: joi.number().required().min(0),
  fat: joi.number().required().min(0),
  dish: joi.string().required(),
  type: joi.string().valid("breakfast", "lunch", "dinner", "snack"),
  calories: joi.number().required().min(0),
});

const resetFoodIntakeSchema = joi.object({
  type: joi.string().valid("breakfast", "lunch", "dinner", "snack"),
});

const schemas = {
  addWaterIntakeSchema,
  foodIntakeSchema,
  resetFoodIntakeSchema,
};

const updateSchema = joi.object({
  name: joi.string().required(),
  gender: joi
    .string()
    .valid(...genders)
    .required(),
  age: joi.number().required(),
  height: joi.number().required(),
  weight: joi.number().required(),
  activity: joi.number().valid(1.2, 1.375, 1.55, 1.725, 1.9).required(),
  avatarURL: joi.string(),
});

module.exports = {
  schemas,
  updateSchema,
};
