const Joi = require("joi");

const authSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string().required(),
  subscription: Joi.string().valid("starter", "pro", "business"),
});



module.exports = { authSchema };
