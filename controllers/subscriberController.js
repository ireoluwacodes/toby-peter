const AsyncHandler = require("express-async-handler");
const { Subscriber } = require("../models/subscriberModel");

const {
  addToMailList,
  deleteFromMailList,
} = require("../utils/mailChimpConfig");

const createSubscriber = AsyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(401);
    throw new Error("Please enter all fields");
  }
  try {
    const findSub = await Subscriber.findOne({ email });
    if (findSub) {
      res.status(403);
      throw new Error("You are already subscribed");
    }

    // const addData = {
    //   members: [
    //     {
    //       email_address: email,
    //       status: "subscribed",
    //       email_type: "html",
    //     },
    //   ],
    // };

    // const dataJson = JSON.stringify(addData);

    // const options = {
    //   uri: `https://us21.api.mailchimp.com/3.0/lists/${process.env.AUDIENCE_ID}`,
    //   method: 'POST',
    //   headers: {
    //     Authorization: `auth ${process.env.MAILCHIMP_API_KEY}`,
    //   },
    //   body: dataJson,
    // };

    // const makeRequest = async (options)=>{
    //   request(options, (error, response, body) => {
    //     if (error) {
    //       throw new Error(error);
    //     } else {
    //       console.log(response)
    //     }
    //   });
    // }
    await addToMailList(email);
    // await makeRequest(options)

    const newSub = await Subscriber.create({
      email,
    });

    return res.status(200).json({
      status: "success",
      message: "Subscribed!",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteSubscriber = AsyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(401);
    throw new Error("Please enter all fields");
  }
  try {
    const deletedSub = await Subscriber.findOneAndDelete({ email });
    if (!deletedSub) {
      res.status(403);
      throw new Error("You are already unsubscribed");
    }

    await deleteFromMailList(email);

    return res.status(200).json({
      status: "success",
      message: "Unsubscribed!",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllSubscribers = AsyncHandler(async (req, res) => {
  try {
    const allSubscribers = await Subscriber.find({});
    if (!allSubscribers) {
      res.status(206);
      throw new Error("You have no subscribers");
    }

    return res.status(200).json({
      status: "success",
      allSubscribers,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createSubscriber,
  deleteSubscriber,
  getAllSubscribers,
};
