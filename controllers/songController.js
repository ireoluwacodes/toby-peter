const AsyncHandler = require("express-async-handler");
const { Song } = require("../models/songModel");
const { cloudinaryUpload } = require("../utils/cloudinaryConfig");
const fs = require("fs");

const createSong = AsyncHandler(async (req, res) => {
  const { title, streamingLink, releaseDate, url } = req.body;

  // initialize for uploading cover art
  // const uploader = (path) => cloudinaryUpload(path, "image");
  // const file = req.file;
  if (!title || !releaseDate || !url) {
    res.status(401);
    throw new Error("Please enter All fields");
  }
  try {
    // // upload the cover art first
    // const { path } = file;
    // const { url } = await uploader(path);
    // fs.unlinkSync(path);

    const newSong = await Song.create({
      title,
      coverArt: url,
      streamingLink,
      releaseDate,
    });

    return res.status(200).json({
      status: "success",
      message: "Successfully created",
      title,
      url,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const uploadCoverArt = AsyncHandler(async (req, res) => {
  try {
    const uploader = (path) => cloudinaryUpload(path, "image");
    const file = req.file;
    const { path } = file;
    const { url } = await uploader(path);
    fs.unlinkSync(path);

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
  if (!id) {
    res.status(403);
    throw new Error("Invalid Parameters");
  }
  try {
    const { title, streamingLink, releaseDate } = req.body;
    if (!title && !streamingLink && !releaseDate) {
      res.status(401);
      throw new Error("Nothing to update");
    }

    const updatedSong = await Song.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedSong) {
      res.status(404);
      throw new Error("Song not Found");
    }

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
  if (!id) {
    res.status(403);
    throw new Error("Invalid Parameters");
  }
  try {
    const deletedSong = await Song.findByIdAndDelete(id);

    if (!deletedSong) {
      res.status(404);
      throw new Error("Song already deleted");
    }

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
  if (!id) {
    res.status(403);
    throw new Error("Invalid Parameters");
  }
  try {
    const getSong = await Song.findById(id);

    if (!getSong) {
      res.status(404);
      throw new Error("Song not Found");
    }

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
    if (!allSongs) {
      res.status(206);
      throw new Error("No song to display");
    }

    return res.status(200).json({
      status: "success",
      allSongs,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getRecentSong = AsyncHandler(async (req, res) => {
  try {
    const allSongs = await Song.find({}).sort({ releaseDate: -1 });

    if (!allSongs) {
      res.status(206);
      throw new Error("No song to display");
    }

    return res.status(200).json({
      status: "success",
      recentSong: allSongs[0],
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
  getRecentSong,
};
