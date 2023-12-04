const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars")
const hbsOptions = require("../hbs")

const transporter = nodemailer.createTransport({
  host : process.env.MAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

transporter.use("compile", hbs(hbsOptions));

module.exports = transporter