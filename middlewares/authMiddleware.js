const AsyncHandler = require("express-async-handler");
const { verifyToken } = require("../utils/jwtToken");
const { User } = require("../models/userModel");

const secret = process.env.JWT_KEY;

const authMiddleware = AsyncHandler(async (req, res, next) => {
  try {
    if (req.headers.authorization.startsWith("Bearer")) {
      const token = req.headers.authorization.split(" ")[1];

      if (!token) throw new Error("Unauthorized");

      const id = await verifyToken(token);
      req.user = { id };
      next();
    } else {
      throw new Error("Unauthorized! no token in header");
    }
  } catch (error) {
    throw new Error(error);
  }
});

const isAdmin = AsyncHandler(async (req, res, next) => {
  try {
    const { id } = req.user;

    const getUser = await User.findById(id);

    if (!getUser.isAdmin) throw new Error("You lack admin priviledges");
    next();
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { authMiddleware, isAdmin };
