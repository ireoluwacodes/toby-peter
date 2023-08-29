const express = require("express")
const { createShow, completeShow, deleteShow, getShow, getAllShows, updateShow } = require("../controllers/showController")
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware")

const showRouter = express.Router()

showRouter.route("/create").post(authMiddleware, isAdmin, createShow)

showRouter.route("/complete/:id").get(authMiddleware, isAdmin, completeShow)

showRouter.route("/update/:id").patch(authMiddleware, isAdmin, updateShow)

showRouter.route("/delete/:id").delete(authMiddleware, isAdmin, deleteShow)

showRouter.route("/:id").get(getShow)

showRouter.route("/").get(getAllShows)


module.exports = {
    showRouter
}