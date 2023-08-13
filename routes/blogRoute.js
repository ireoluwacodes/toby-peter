const express = require("express");
const {
  getAllBlogs,
  createBlog,
  deleteBlog,
} = require("../controllers/blogController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const blogRouter = express.Router();

blogRouter.route("/").get(getAllBlogs);

blogRouter.route("/create").post(authMiddleware, isAdmin, createBlog);

blogRouter.route("/delete/:id").delete(authMiddleware, isAdmin, deleteBlog);

module.exports = {
  blogRouter,
};
