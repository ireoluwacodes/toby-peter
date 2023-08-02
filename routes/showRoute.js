const express = require("express")
const { createShow, completeShow, deleteShow, getShow, getAllShows } = require("../controllers/showController")
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware")

const showRouter = express.Router()

showRouter.route("/create").post(authMiddleware, isAdmin, createShow)

showRouter.route("/complete/:id").post(completeShow)

showRouter.route("/delete/:id").delete(authMiddleware, isAdmin, deleteShow)

showRouter.route("/:id").get(getShow)

showRouter.route("/").get(getAllShows)


module.exports = {
    showRouter
}