const Joi = require("joi");

const authSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string().required(),
  goal: Joi.string().valid("Loose fat", "Maintain", "Gain muscle").required(),
  gender: Joi.string().valid("Male", "Female").required(),
  age: Joi.number().required(),
  height: Joi.number().required(),
  weight: Joi.number().required(),
  activity: Joi.number().valid(1.2, 1.375, 1.55, 1.725, 1.9).required(),
});

module.exports = { authSchema };
