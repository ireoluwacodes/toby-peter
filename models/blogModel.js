const mongoose = require("mongoose"); // Erase if already required

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    text: {
      type: String,
    },
    link: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
const Blog = mongoose.model("Blog", blogSchema);

module.exports = { Blog };
