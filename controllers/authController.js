const AsyncHandler = require("express-async-handler");

const { User } = require("../models/userModel");
const { hashPassword, comparePassword } = require("../utils/cryptPassword");
const { signToken } = require("../utils/jwtToken");
const { transporter, mailOptions } = require("../utils/mailer");
const { Subscriber } = require("../models/subscriberModel");

const registerAuth = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new Error("Please enter all fields");
  try {
    const find = await User.find({});

    if (find.length == 1) throw new Error("Admin user Already exists");

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
  if (!email || !password) throw new Error("Please enter all fields");
  try {
    const findUser = await User.findOne({ email });
    if (!findUser) throw new Error("User not Found");
    if (!findUser.isAdmin) throw new Error("User is not an Admin");

    const validate = await comparePassword(password, findUser.hash);
    if (!validate) throw new Error("Invalid Credentials");

    // const refreshToken = signToken(findUser._id);

    // await User.findByIdAndUpdate(
    //   findUser._id,
    //   {
    //     refreshToken,
    //   },
    //   {
    //     new: true,
    //   }
    // );

    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   maxAge: 72 * 60 * 60 * 1000,
    // });

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

const forgotPassword = AsyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new Error("Please enter all fields");
  try {
    const findUser = await User.findOne({ email });
    if (!findUser) throw new Error("User not Found");

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

const changePassword = AsyncHandler(async (req,res)=>{
    const {id} = req.user
    if(!id) throw new Error("Unauthorized")
    try {
        const {password} = req.body
        if (!password) throw new Error("Enter all fields")

        const findUser = await User.findById(id)
        if(!findUser) throw new Error("User not Found")

        const hash = await hashPassword(password)
        findUser.hash = hash

        await findUser.save()

        return res.status(200).json({
            status : "success",
            message : "Password updated Successfully"
        })
    } catch (error) {
        throw new Error(error)
    }
})
 
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

module.exports = {
  registerAuth,
  loginAuth,
  forgotPassword,
  changePassword,
  // sendNewsletter
};