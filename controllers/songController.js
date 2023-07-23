const AsyncHandler = require("express-async-handler");

const { Song } = require("../models/songModel");
const { cloudinaryUpload } = require("../utils/cloudinaryConfig");
const fs = require("fs");

const createSong = AsyncHandler(async (req, res) => {
  const { title, streamingLink } = req.body;
  if (!title && !streamingLink) throw new Error("Please enter All fields");
  try {
    const newSong = await Song.create({
      title,
      streamingLink,
    });

    return res.status(200).json({
      status: "success",
      message: "Successfully created",
      title,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const uploadCoverArt = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Invalid Parameters");
  try {
    const uploader = (path) => cloudinaryUpload(path, "image");
    const file = req.file;
    const { path } = file;
    const {url} = await uploader(path);
    fs.unlinkSync(path);

    const updatedSong = await Song.findByIdAndUpdate(
      id,
      {
        coverArt: url,
      },
      {
        new: true,
      }
    );
    if (!updatedSong) throw new Error("song not found");

    return res.status(200).json({
      status: "success",
      message: "Uploaded!",
      url,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updateSong = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Invalid Parameters");
  try {
    const { title, streamingLink } = req.body;
    if (!title && !streamingLink) throw new Error("Nothing to update");

    const updatedSong = await Song.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedSong) throw new Error("Song not Found");

    return res.status(200).json({
      status: "success",
      message: "Successfully updated",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteSong = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Invalid Parameters");
  try {
    const deletedSong = await Song.findByIdAndDelete(id);

    if (!deletedSong) throw new Error("Song already deleted");

    return res.status(200).json({
      status: "success",
      message: "Successfully deleted",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getSong = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Invalid Parameters");
  try {
    const getSong = await Song.findById(id);

    if (!getSong) throw new Error("Song not Found");

    return res.status(200).json({
      status: "success",
      song: getSong,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllSongs = AsyncHandler(async (req, res) => {
  try {
    const allSongs = await Song.find({});
    if (!allSongs) throw new Error("No song to display");

    return res.status(200).json({
      status: "success",
      allSongs,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createSong,
  uploadCoverArt,
  updateSong,
  deleteSong,
  getSong,
  getAllSongs,
};
