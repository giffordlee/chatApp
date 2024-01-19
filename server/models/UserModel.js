const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Your username is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
  }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // If password is not modified, proceed to the next middleware
  }

  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    return next(error);
  }
});

module.exports = mongoose.model("User", userSchema);
