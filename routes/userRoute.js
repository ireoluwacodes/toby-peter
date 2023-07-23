const express = require("express");
const { registerAuth, loginAuth, forgotPassword, changePassword, sendNewsletter } = require("../controllers/authController");
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware")

const userRouter = express.Router()

userRouter.route("/register").post(registerAuth)

userRouter.route("/login").post(loginAuth)

userRouter.route("/forgot-pass").post(forgotPassword)

userRouter.route("/change-pass").put(authMiddleware, isAdmin, changePassword)

// userRouter.route("/send-news").put(authMiddleware, isAdmin, sendNewsletter)

module.exports = {
    userRouter
}