const transporter = require("../config/mailConfig");

const sendContactMail = async (
  subject,
  template,
  name,
  eventName,
  email,
  companyName,
  myDate,
  location,
  type,
  expectedGuests,
  description
) => {
  try {
    let mailOption = {
      from: email,
      to: "tobipetermanagement@gmail.com",
      subject,
      template,
      context: {
        name,
        eventName,
        email,
        companyName,
        myDate,
        location,
        type,
        expectedGuests,
        description,
      },
    };
    let info = await transporter.sendMail(mailOption);
    return info;
  } catch (error) {
    throw new Error(error);
  }
};

const sendForgotMail = async (email, subject, message) => {
  try {
    let mailOption = {
      from: process.env.USER,
      to: email,
      subject,
      html: message,
    };
    let info = await transporter.sendMail(mailOption);
    return info;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  sendContactMail,
  sendForgotMail,
};
