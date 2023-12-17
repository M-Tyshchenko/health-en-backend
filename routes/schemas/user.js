const joi = require('joi')

const addWaterIntakeSchema = joi.object(
    {
        waterIntake: joi.number().required().max(7000)
    }
)

const schemas = {
    addWaterIntakeSchema,
}

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
    avatarURL: Joi.string(),
  });

module.exports = {
    schemas,
    updateSchema,
}