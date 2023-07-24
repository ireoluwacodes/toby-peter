const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var showSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  ticketLink: {
    type: String,
    required: true,
  },
  isPast: {
    type: Boolean,
    default: false,
  },
});

//Export the model
const Show = mongoose.model("Show", showSchema);

module.exports = {
  Show,
};
