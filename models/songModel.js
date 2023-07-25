const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  coverArt: {
    type: String,
  },
  streamingLink: {},
  releaseDate: {
    type: Date,
    required: true,
  },
});

//Export the model
const Song = mongoose.model("Song", songSchema);

module.exports = {
  Song,
};
