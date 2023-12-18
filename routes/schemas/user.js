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

const updateSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
    password: Joi.string(),
    goal: Joi.string().valid("Lose fat", "Maintain", "Gain muscle"),
    gender: Joi.string().valid("Male", "Female"),
    age: Joi.number(),
    height: Joi.number(),
    weight: Joi.number(),
    activity: Joi.number().valid(1.2, 1.375, 1.55, 1.725, 1.9),
  });

module.exports = {
    schemas,
    updateSchema,
}
