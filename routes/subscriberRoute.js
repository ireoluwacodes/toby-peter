const express = require("express")
const { createSubscriber, deleteSubscriber, getAllSubscribers } = require("../controllers/subscriberController")
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware")

const subscriberRouter = express.Router()


subscriberRouter.route("/create").post(createSubscriber)

subscriberRouter.route("/").get(authMiddleware, isAdmin, getAllSubscribers)

subscriberRouter.route("/delete").delete(deleteSubscriber)

module.exports = {
    subscriberRouter
}