const mailchimp = require("@mailchimp/mailchimp_marketing");

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: "us21",
});

const addToMailList = async (email) => {
  try {
    const listId = process.env.AUDIENCE_ID;

    const response = await mailchimp.lists.addListMember(
      listId,
      {
        email_address: email,
        status: "subscribed",
        email_type: "html",
      },
      {
        skipMergeValidation: true,
      }
    );

    return response;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteFromMailList = async (email) => {
  try {
    const listId = process.env.AUDIENCE_ID;

    const response = await mailchimp.lists.deleteListMember(listId, email);

    return response;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  mailchimp,
  addToMailList,
  deleteFromMailList,
};
