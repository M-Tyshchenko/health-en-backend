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
      enum: ["lose fat", "maintain", "gain muscle"],
      default: "lose fat",
    },

    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
    },

    age: {
      type: Number,
      required: true,
      min: 1,
      max: 150,
    },

    height: {
      type: Number,
      required: true,
      min: 50,
      max: 300,
    },

    weight: {
      type: Number,
      required: true,
      min: 5,
      max: 400,
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

  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

module.exports = mongoose.model("User", userSchema);
