const AsyncHandler = require("express-async-handler");
const { User } = require("../models/userModel");
const { hashPassword, comparePassword } = require("../utils/cryptPassword");
const {
  signToken,
  signRefreshToken,
  verifyToken,
} = require("../utils/jwtToken");
const { transporter, mailOptions } = require("../utils/mailer");
const { cloudinaryUpload } = require("../utils/cloudinaryConfig");
const fs = require("fs");
const { Subscriber } = require("../models/subscriberModel");

const registerAuth = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(401);
    throw new Error("Please enter all fields");
  }
  try {
    const find = await User.find({});

    if (find.length == 1) {
      res.status(403);
      throw new Error("Admin user Already exists");
    }

    const hash = await hashPassword(password);

    const newAdmin = await User.create({
      email,
      hash,
      isAdmin: true,
    });
    return res.status(200).json({
      status: "success",
      message: "Admin created successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const loginAuth = AsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(401);
    throw new Error("Please enter all fields");
  }
  try {
    const findUser = await User.findOne({ email });
    if (!findUser) {
      res.status(404);
      throw new Error("User not Found");
    }
    if (!findUser.isAdmin) {
      res.status(403);
      throw new Error("User is not an Admin");
    }

    const validate = await comparePassword(password, findUser.hash);
    if (!validate) {
      res.status(401);
      throw new Error("Invalid Credentials");
    }

    const refreshToken = await signRefreshToken(findUser._id);

    await User.findByIdAndUpdate(
      findUser._id,
      {
        refreshToken,
      },
      {
        new: true,
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
      secure: true,
      sameSite: "none",
    });

    const token = await signToken(findUser._id);

    return res.status(200).json({
      status: "Success",
      message: "Login successful",
      email,
      token,
    });
  } catch (error) {
    next(error);
  }
});

const refresh = AsyncHandler(async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      res.status(401);
      throw new Error("No refresh token in cookie");
    }

    const findUser = await User.findOne({ refreshToken });
    if (!findUser) {
      res.status(404);
      throw new Error("User with refresh token not found");
    }

    const id = await verifyToken(refreshToken);
    if (id != findUser._id) {
      res.status(403);
      throw new Error("Could not verify refresh token");
    }

    const token = await signToken(findUser._id);

    return res.status(200).json({
      status: "success",
      token,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const forgotPassword = AsyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(401);
    throw new Error("Please enter all fields");
  }
  try {
    const findUser = await User.findOne({ email });
    if (!findUser) {
      res.status(404);
      throw new Error("User not Found");
    }

    const tempPassword = Math.round(Math.random() * 1e7);

    const hash = await hashPassword(`${tempPassword}`);

    findUser.hash = hash;

    // send temporary password to mail
    const message = `Use this Temporary password to access your account - ${tempPassword}. 
    Change your password as soon as you get this mail. If you did not initiate this request use the temporary password to secure your account and update your password`;

    let mailOption = mailOptions(email, "Forgot Passwordl", message);

    const info = await transporter.sendMail(mailOption);
    console.log(info.response);

    await findUser.save();

    return res.status(200).json({
      status: "success",
      message: "Check your mail for more info",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const changePassword = AsyncHandler(async (req, res) => {
  const { id } = req.user;
  if (!id) {
    res.status(401);
    throw new Error("Unauthorized");
  }
  try {
    const { password } = req.body;
    if (!password) {
      res.status(401);
      throw new Error("Enter all fields");
    }

    const findUser = await User.findById(id);
    if (!findUser) {
      res.status(404);
      throw new Error("User not Found");
    }

    const hash = await hashPassword(password);
    findUser.hash = hash;

    await findUser.save();

    return res.status(200).json({
      status: "success",
      message: "Password updated Successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const logoutAuth = AsyncHandler(async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      res.status(403);
      throw new Error("No refresh token in cookie");
    }
    const findUser = await User.findOne({ refreshToken });
    if (!findUser) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });
      return res.sendStatus(403);
    }

    await User.findByIdAndUpdate(
      findUser._id,
      {
        refreshToken: " ",
      },
      {
        new: true,
      }
    );

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.sendStatus(204);
  } catch (error) {
    throw new Error(error);
  }
});

// const sendNewsletter = AsyncHandler(async(req,res)=>{
//    const {subject, message} = req.body
//    if(!subject || !message) throw new Error("Please enter all fields")
//    try {
//     const Subscribers = await Subscriber.find({})

//     const allSubMail = Subscribers.map((item)=>{
//       return item.email
//     })

//    } catch (error) {
//     throw new Error(error)
//    }
// })

const uploadUserAlbum = AsyncHandler(async (req, res) => {
  const { id } = req.user;
  if (!id) {
    res.status(401);
    throw new Error("Unauthorized");
  }
  try {
    const uploader = (path) => cloudinaryUpload(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    }

    const { album } = await User.findById(id);
    const findUser = await User.findByIdAndUpdate(
      id,
      {
        album: [...album, ...urls],
      },
      { new: true }
    );

    return res.status(201).json({
      message: "success",
      album: findUser.album,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAlbum = AsyncHandler(async (req, res) => {
  try {
    const find = await User.find({});

    const album = find[0].album;
    return res.status(200).json({
      album,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteImage = AsyncHandler(async (req, res) => {
  const { id } = req.user;
  if (!id) {
    res.status(401);
    throw new Error("Unauthorized");
  }
  try {
    const { url } = req.body;
    if (!url) {
      res.status(400);
      throw new Error("No url in body");
    }
    const updatedAdmin = await User.findByIdAndUpdate(
      id,
      {
        $pull: {
          album: {
            url,
          },
        },
      },
      {
        new: true,
      }
    );
    return res.status(200).json({
      status: "success",
      album: updatedAdmin.album,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  registerAuth,
  loginAuth,
  forgotPassword,
  changePassword,
  refresh,
  logoutAuth,
  uploadUserAlbum,
  getAlbum,
  deleteImage,
  // sendNewsletter
};
