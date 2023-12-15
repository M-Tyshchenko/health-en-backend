const { Schema, model } = require("mongoose");
const {handleMongooseError} = require('../helpers')

const date = new Date;
const dateString = date.toDateString();

const dailySchema = new Schema(
  {
    waterIntake: {
      type: Number,
      default: 0,
      required: true,
    },
    foodIntake: {
      carbohidrates: {
        type: Number,
        default: 0,
        required: true,
      },
      protein: {
        type: Number,
        default: 0,
        required: true,
      },
      fat: {
        type: Number,
        default: 0,
        required: true,
      },
    },
    calories: {
      type: Number,
      default: 0,
      required: true,
    },
  }, {timestamps: false, versionKey: false}
)


const statsSchema = new Schema({
  dates: [
    {
      date: {
        type: String,
        required: true,
        default: dateString,
        
      },
      stats: dailySchema,
      
    }, 
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
}, {versionKey: false});
statsSchema.post('save', handleMongooseError);
const Stats = model('stat', statsSchema);

module.exports = {
    Stats,
}