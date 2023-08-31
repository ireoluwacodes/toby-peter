const AsyncHandler = require("express-async-handler");
const { Blog } = require("../models/blogModel");

const createBlog = AsyncHandler(async (req, res) => {
  try {
    const { title, author, text, link } = req.body;
    if (!title || !author || !text || !link) {
      res.status(400);
      throw new Error("Please enter all fields");
    }
    const newBlog = await Blog.create({
      title,
      author,
      text,
      link,
    });
    return res.status(201).json({
      message: "blog created",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBlog = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(401);
    throw new Error("invalid parameters");
  }
  try {
    const findBlog = await Blog.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Blog deleted",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updateBlog = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(401);
    throw new Error("invalid parameters");
  }
  try {
    const { title, author, text, link } = req.body;
    if (!title && !author && !text && !link) {
      res.status(400);
      throw new Error("Nothing to update");
    }
    const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json({
      message: "Blog updated",
      blog: updateBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBlogs = AsyncHandler(async (req, res) => {
  try {
    const AllBlogs = await Blog.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "success",
      AllBlogs,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getBlog = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(401);
    throw new Error("invalid parameters");
  }
  try {
    const blog = await Blog.findById(id);

    return res.status(200).json({
      message: "success",
      blog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
};
