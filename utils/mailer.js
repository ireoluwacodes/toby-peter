const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host : process.env.MAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

const mailOptions = (email, subject, message) => {
  let mailOption = {
    from: process.env.USER,
    to: email,
    subject: subject,
    text: "message",
    html: message,
  };
  return mailOption;
};

module.exports = { transporter, mailOptions };
