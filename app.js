const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const authRouter = require("./routes/api/users");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

require("dotenv").config();

app.use(logger(formatsLogger));

// cors
app.use(cors());

// parse application/json
app.use(express.json());

app.use(express.static("public"));

app.use("/api/users", authRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;

// mongodb+srv://Vitalii:EVA05LygttAtQuLa@cluster0.suvr4pr.mongodb.net/test
// EVA05LygttAtQuLa
