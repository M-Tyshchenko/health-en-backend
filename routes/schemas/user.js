const joi = require("joi");

const addWaterIntakeSchema = joi.object({
  waterIntake: joi.number().required().max(7000),
});

const getStatsSchema = joi.object({
  dateFrom: joi.string(),
  dateTo: joi.string(),
});

const addFoodIntakeSchema = joi.object({
  carbohidrates: joi.number().required(),
  protein: joi.number().required(),
  fat: joi.number().required(),
  dish: joi.string().required(),
  type: joi.string().valid("breakfast", "lunch", "dinner", "snack"),
});

const updateFoodIntakeSchema = joi.object(
  {
        carbohidrates: joi.number().required(),
    protein: joi.number().required(),
    fat: joi.number().required(),
    dish: joi.string().required(),
        type: joi.string().valid("breakfast", "lunch", "dinner", "snack")
  }
)

const schemas = {
  addWaterIntakeSchema,
  getStatsSchema,
  addFoodIntakeSchema,
  updateFoodIntakeSchema
};

const updateSchema = joi.object({
  name: joi.string().required(),
  gender: joi.string().valid("male", "female").required(),
  age: joi.number().required(),
  height: joi.number().required(),
  weight: joi.number().required(),
  activity: joi.number().valid(1.2, 1.375, 1.55, 1.725, 1.9).required(),
});

module.exports = {
  schemas,
  updateSchema,
};
