const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

const { notFound } = require("./middlewares/notFound");
const { errHandler } = require("./middlewares/errHandler");
const { CreateDb } = require("./config/db");
const { userRouter } = require("./routes/userRoute");
const { subscriberRouter } = require("./routes/subscriberRoute");
const { showRouter } = require("./routes/showRoute");
const { songRouter } = require("./routes/songRoute");
const { blogRouter } = require("./routes/blogRoute");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["https://www.tobipeter.com"],
    methods: ["POST, GET, PUT, PATCH, DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Backend Home page");
});

app.use("/api/admin", userRouter);

app.use("/api/subscribe", subscriberRouter);

app.use("/api/show", showRouter);

app.use("/api/song", songRouter);

app.use("/api/blog", blogRouter);

app.use(notFound);
app.use(errHandler);

const PORT = process.env.PORT;

const startApp = async () => {
  try {
    await CreateDb();
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startApp();
