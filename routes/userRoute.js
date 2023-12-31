const express = require("express");
const { registerAuth, loginAuth, forgotPassword, changePassword, sendNewsletter, refresh, logoutAuth, uploadUserAlbum, getAlbum, deleteImage, contactMe } = require("../controllers/authController");
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");
const { uploadPhoto } = require("../middlewares/uploadImage");

const userRouter = express.Router()

userRouter.route("/register").post(registerAuth)

userRouter.route("/login").post(loginAuth)

userRouter.route("/refresh").get(refresh)

userRouter.route("/forgot-pass").post(forgotPassword)

userRouter.route("/change-pass").put(authMiddleware, isAdmin, changePassword)

userRouter.route("/logout").get(logoutAuth)

userRouter.route("/contact").post(contactMe)

userRouter.route("/upload").post(authMiddleware, isAdmin, uploadPhoto.array("images", 20), uploadUserAlbum)

userRouter.route("/album").get(getAlbum)

userRouter.route("/delete-slide").put(authMiddleware, isAdmin, deleteImage)

// userRouter.route("/send-news").put(authMiddleware, isAdmin, sendNewsletter)

module.exports = {
    userRouter
}