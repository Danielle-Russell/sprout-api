require("dotenv").config();
const express = require("express");
const router = express.Router();
const app = express();

const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const sprouts = require("./router");
const activityRouter = require("./activityRouter");
const healthRouter = require("./healthRouter");
const milestoneRouter = require("./milestoneRouter");
const growthRouter = require("./growthRouter");
const authRouter = require("./authRouter");
var bodyParser = require("body-parser");

app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser({ limit: "4MB" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.use("/api/sprouts", sprouts);

app.use("/api/activities", activityRouter);

app.use("/api/health", healthRouter);

app.use("/api/milestones", milestoneRouter);

app.use("/api/growth", growthRouter);

app.use("/api/users", authRouter);

const { NODE_ENV } = require("./config");

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));

app.use(helmet());

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    console.error(error);
    response = { message: error.message, error };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
