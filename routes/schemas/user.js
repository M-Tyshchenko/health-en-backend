const joi = require('joi')

const addWaterIntakeSchema = joi.object(
    {
        waterIntake: joi.number().required().max(7000)
    }
)

const schemas = {
    addWaterIntakeSchema,
}

module.exports = {
    schemas,
}