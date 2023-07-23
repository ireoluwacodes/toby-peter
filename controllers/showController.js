const AsyncHandler = require("express-async-handler");
const { Show } = require("../models/showModel");

const createShow = AsyncHandler(async (req, res) => {
  const { title, venue, date, ticketLink } = req.body;
  if (!title || !venue || !date || !ticketLink)
    throw new Error("please enter all fields");
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
  if (!id) throw new Error("invalid parameters");
  try {
    const findShow = await Show.findById(id);
    if (!findShow) throw new Error("show not Found");

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

const getShow = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("invalid parameters");
  try {
    const findShow = await Show.findById(id);
    if (!findShow) throw new Error("show not Found");

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
  if (!id) throw new Error("invalid parameters");
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
    const AllShows = await Show.find({});

    if (!AllShows) throw new Error("You have not created any shows");
     
    const completedShows = AllShows.map((show) => {
      if (show.isPast) {
        return show;
      }
      return;
    });

    const pendingShows = AllShows.map((show) => {
      if (show.isPast) {
        return;
      }
      return show;
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
};
