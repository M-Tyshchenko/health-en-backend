const { Schema, model } = require("mongoose");
const {handleMongooseError} = require('../helpers')

const statsSchema = new Schema({
  dates: [
    {
      date: {
        type: Date,
        default: new Date(),
      },
      waterIntake: {
        type: Number,
        min: 0,
        max: 5000,
      },
      foodIntake: {
        carbohidrates: {
          type: Number,
          default: 0,
        },
        protein: {
          type: Number,
          default: 0,
        },
        fat: {
          type: Number,
          default: 0,
        },
      },
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});
statsSchema.post('save', handleMongooseError);
const Stats = model('stat', statsSchema);

module.exports = {
    Stats,
}