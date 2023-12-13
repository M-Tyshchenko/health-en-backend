const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    
    token: {
      type: String,
      default: "",
    },
    
  },

  { versionKey: false }
);

module.exports = mongoose.model("User", userSchema);
