const express = require("express");
const {
  getAllBlogs,
  createBlog,
  deleteBlog,
  updateBlog,
  getBlog,
} = require("../controllers/blogController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const blogRouter = express.Router();

blogRouter.route("/:id").get(getBlog);

blogRouter.route("/").get(getAllBlogs);

blogRouter.route("/create").post(authMiddleware, isAdmin, createBlog);

blogRouter.route("/delete/:id").delete(authMiddleware, isAdmin, deleteBlog);

blogRouter.route("/update/:id").patch(authMiddleware, isAdmin, updateBlog);

module.exports = {
  blogRouter,
};
