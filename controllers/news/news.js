const { News } = require("../../models/news");

const getNews = async (req, res) => {
  const news = await News.find({});

  res.status(200).json({
    news,
  });
};

module.exports = getNews;
