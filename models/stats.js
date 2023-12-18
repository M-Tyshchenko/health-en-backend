const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");

const foodIntakeSchema = new Schema({
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
  dish: {
    type: String,
    ref: "RecommendedFood",
    required: false,
    default: null
  },
});

const dailySchema = new Schema(
  {
    waterIntake: {
      type: Number,
      default: 0,
      required: true,
      min: 0,
      max: 7000,
    },
    foodIntake: {
      breakfast: [foodIntakeSchema],
      lunch: [foodIntakeSchema],
      dinner: [foodIntakeSchema],
      snack: [foodIntakeSchema],
    },
    calories: {
      type: Number,
      default: 0,
      required: true,
    },
    weight: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { timestamps: false, versionKey: false }
);

const statsSchema = new Schema(
  {
    dates: [
      {
        date: {
          type: String,
          required: true,
        },
        stats: dailySchema,
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { versionKey: false }
);
statsSchema.post("save", handleMongooseError);
const Stats = model("stat", statsSchema);

module.exports = {
  Stats,
};
