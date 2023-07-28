const express = require("express")
const { createSong, updateSong, deleteSong, getSong, getAllSongs, uploadCoverArt, getRecentSong } = require("../controllers/songController")
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware")
const { uploadPhoto } = require("../middlewares/uploadImage")

const songRouter = express.Router()


songRouter.route("/create").post(authMiddleware, isAdmin, createSong)

songRouter.route("/upload-cover/:id").put(authMiddleware, isAdmin, uploadPhoto.single("image"), uploadCoverArt)

songRouter.route("/update/:id").put(authMiddleware, isAdmin, updateSong)

songRouter.route("/delete/:id").delete(authMiddleware, isAdmin, deleteSong)

songRouter.route("/recent").get(getRecentSong)

songRouter.route("/:id").get(getSong)

songRouter.route("/").get(getAllSongs)


module.exports = {
    songRouter
}