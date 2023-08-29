const AsyncHandler = require("express-async-handler");
const { Show } = require("../models/showModel");

const createShow = AsyncHandler(async (req, res) => {
  const { title, venue, date, ticketLink } = req.body;
  if (!title || !venue || !date || !ticketLink) {
    res.status(401);
    throw new Error("please enter all fields");
  }
  try {
    const newShow = await Show.create({
      title,
      venue,
      date,
      ticketLink,
    });

    return res.status(200).json({
      status: "success",
      message: "New show created",
      title,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const completeShow = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(403);
    throw new Error("invalid parameters");
  }
  try {
    const findShow = await Show.findById(id);
    if (!findShow) {
      res.status(404);
      throw new Error("show not Found");
    }
    findShow.isPast = true;
    await findShow.save();

    return res.status(200).json({
      status: "success",
      message: "Show Completed",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updateShow = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(403);
    throw new Error("invalid parameters");
  }
  try {
    const { title, venue, date, ticketLink } = req.body;
    if (!title && !venue && !date && !ticketLink) {
      res.status(401);
      throw new Error("please enter all fields");
    }
    const findShow = await Show.findByIdAndUpdate(id, req.body, { new: true });
    if (!findShow) {
      res.status(404);
      throw new Error("show not Found");
    }

    return res.status(200).json({
      message: "Show updated",
      show: findShow,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getShow = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(403);
    throw new Error("invalid parameters");
  }
  try {
    const findShow = await Show.findById(id);
    if (!findShow) {
      res.status(404);
      throw new Error("show not Found");
    }

    return res.status(200).json({
      status: "success",
      show: findShow,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteShow = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(403);
    throw new Error("invalid parameters");
  }
  try {
    const deletedShow = await Show.findByIdAndDelete(id);

    return res.status(200).json({
      status: "success",
      message: "Show Deleted",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllShows = AsyncHandler(async (req, res) => {
  try {
    const AllAscShows = await Show.find({}).sort({ date: 1 });
    const AllDescShows = await Show.find({}).sort({ date: -1 });

    if (!AllAscShows) {
      res.status(206);
      throw new Error("You have not created any shows");
    }

    const completedShows = [];
    const pendingShows = [];

    AllDescShows.map((show) => {
      if (show.isPast) {
        completedShows.push(show);
      }
    });

    AllAscShows.map((show) => {
      if (!show.isPast) {
        pendingShows.push(show);
      }
    });

    return res.status(200).json({
      status: "success",
      completedShows,
      pendingShows,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createShow,
  completeShow,
  deleteShow,
  getAllShows,
  getShow,
  updateShow
};
