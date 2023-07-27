const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  hash: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    default: " ",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

//Export the model
const User = mongoose.model("User", userSchema);

module.exports = {
  User,
};
