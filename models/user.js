const mongoose = require("mongoose");
const { handleMongooseError } = require("../helpers");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },

    password: {
      type: String,
      required: [true, "Set password for user"],
    },

    goal: {
      type: String,
      enum: ["Lose fat", "Maintain", "Gain muscle"],
      default: "Lose fat",
    },

    gender: {
      type: String,
      enum: ["Male", "Female"],
      default: "Male",
    },

    age: {
      type: Number,
      required: true,
    },

    height: {
      type: Number,
      required: true,
    },

    weight: {
      type: Number,
      required: true,
    },

    activity: {
      type: Number,
      enum: [1.2, 1.375, 1.55, 1.725, 1.9],
      default: 1.2,
    },

    bmr: {
      type: Number,
    },

    water: {
      type: Number,
    },

    nutrients: {
      protein: Number,
      fat: Number,
      carbonohidrates: Number,
    },

    token: {
      type: String,
      default: "",
    },

    avatarURL: {
      type: String,
      required: true,
    },
  },

  { versionKey: false }
);

userSchema.post("save", handleMongooseError);

module.exports = mongoose.model("User", userSchema);
