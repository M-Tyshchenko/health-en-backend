const joi = require("joi");

const addWaterIntakeSchema = joi.object({
  waterIntake: joi.number().required().max(7000),
});

const getStatsSchema = joi.object({
  dateFrom: joi.date(),
  dateTo: joi.date(),
});

const addFoodIntakeSchema = joi.object(
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
};

module.exports = {
  schemas,
};
