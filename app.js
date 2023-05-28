const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const authRouter = require("./routes/api/users");
const noticeRouter = require("./routes/api/notice");
const petsRouter = require("./routes/api/cardPets");
const swaggerUi = require("swagger-ui-express");
const swaggerjsdoc = require("./swagger.json");
const newsRouter = require("./routes/api/news");
// const sponsorsRouter = require("./routes/api/sponsors");

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
app.use("/api/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerjsdoc));
app.use("/api/notices", noticeRouter);
app.use("/api/cardPets", petsRouter);
app.use("/api/news", newsRouter);
// app.use("/api/sponsors", sponsorsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
