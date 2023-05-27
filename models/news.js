const { Schema, model } = require("mongoose");

const newsSchema = Schema(
  {
    title: {
      type: String,
    },
    imgUrl: {
      type: String,
    },
    text: {
      type: String,
    },
    url: {
      type: String,
    },
    date: {
      type: String,
    },
  },
  { versionKey: false }
);

const News = model("news", newsSchema);

module.exports = {
  News,
};
