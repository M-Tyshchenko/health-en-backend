const Joi = require("joi");
const { goals, genders, activityIndexes } = require("../../helpers/constants");

const emailDomain = { minDomainSegments: 2, tlds: { allow: ["com", "net"] } };

const authSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email(emailDomain).required(),
  password: Joi.string().required(),
  goal: Joi.string()
    .valid(...goals)
    .required(),
  gender: Joi.string()
    .valid(...genders)
    .required(),
  age: Joi.number().min(1).max(150).required(),
  height: Joi.number().min(50).max(300).required(),
  weight: Joi.number().min(5).max(400).required(),
  activity: Joi.number()
    .valid(...activityIndexes)
    .required(),
  avatarURL: Joi.string(),
});

const loginSchema = Joi.object({
  email: Joi.string().email(emailDomain).required(),
  password: Joi.string().required(),
});

const forgotSchema = Joi.object({
  email: Joi.string().email(emailDomain).required(),
});

module.exports = { authSchema, loginSchema, forgotSchema };
