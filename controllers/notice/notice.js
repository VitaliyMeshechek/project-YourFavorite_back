const { Notice } = require("../../models/notice");
const { HttpError } = require("../../helpers/HttpError");
const gravatar = require("gravatar");
const { User } = require("../../models/userSchema");

const createNotice = async (req, res, next) => {
  let noticeAvatarURL = null;

  if (req.file) {
    const { email } = req.user;
    const avatarURL = gravatar.url(email, {
      s: "200",
      r: "pg",
      d: "mm",
    });
    noticeAvatarURL = avatarURL;
  }

  const { _id: owner } = req.user;

  const notice = await Notice.create([
    {
      ...req.body,
      avatarURL: noticeAvatarURL,
      owner,
    },
  ]);

  res.status(200).json({ notice, message: "Successfully" });
};

const addNoticeFavorite = async (req, res) => {
  const { _id, favorite } = req.user;
  const { id } = req.params;
  if (favorite.includes(id)) {
    res.status(409).json({
      message: `Notice with id: ${id} is already in your favorite list`,
    });
  }
  const user = await User.findByIdAndUpdate(
    _id,
    {
      $push: { favorite: id },
    },
    {
      new: true,
    }
  );
  res.status(201).json({ favorite: user.favorite });

  // const { _id: userId } = req.user;

  // const { id } = req.params;

  // const { body } = req;

  // const result = await User.findOne({ _id: id });
  // res.status(409).json({
  //   message: `Notice with id: ${id} is already in your favorite list`,
  // });

  // // if (favorite.includes(userId)) {
  // //   throw HttpError(500, "Notice already added to favorites");
  // // }

  // const notice = await User.findOneAndUpdate(
  //   { _id: id },
  //   { $push: { favorite: { userId, body } } }
  // );

  // res.status(200).json({
  //   favorite: notice.favorite,
  //   message: "Success",
  // });
};

const deleteNoticeFavorite = async (req, res, next) => {
  const { _id, favorite } = req.user;
  const { id } = req.params;

  if (!favorite.includes(id)) {
    res.status(409).json({
      message: `The notice is not in the favorites`,
    });
  }

  const notice = await User.findOneAndUpdate(
    _id,
    {
      $pull: { favorite: id },
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    favorite: notice.favorite,
    id,
    message: "Successfully removed from favorites",
  });
};

const deleteUserNotice = async (req, res, next) => {
  const { _id: userId } = req.user;

  const { id } = req.params;

  const delNotice = await Notice.findOne({ _id: id });

  if (!delNotice) {
    throw HttpError(404, "Notice does not exist");
  }

  await Notice.findOneAndRemove({ _id: id, owner: userId });

  res.status(200).json({ message: "Notice successfully deleted" });
};

const getNoticeByCategory = async (req, res) => {
  const { categoryName: category, id } = req.params;
  const { query } = req.query;

  if (!query && !category) {
    const allNotices = await Notice.find({});
    res.status(200).json(allNotices);
  } else if (category && !query && !id) {
    const noticesByCategory = await Notice.find({ category });
    res.status(200).json(noticesByCategory);
  } else if (category && query && !id) {
    const notices = await Notice.find({ query, category });
    res.status(200).json(notices);
  } else if (category && query && id) {
    const notices = await Notice.find({ query, category, _id: id });
    res.status(200).json(notices);
  } else if (id) {
    const notice = await Notice.findById(id);
    if (notice) {
      res.status(200).json([notice]);
    } else {
      res.status(404).json({ error: "Notice not found" });
    }
  } else {
    res.status(400).json({ error: "No search parameters provided" });
  }
};

const getUserByFavorite = async (req, res) => {
  const { _id: userId } = req.user;
  const notices = await User.findById(userId)
    .populate("favorite")
    .select("favorite");

  res.status(200).json(...notices.favorite);
};

const getUserByNotices = async (req, res) => {
  const { _id: userId } = req.user;
  const { page, limit } = req.query;
  const skip = (page - 1) * limit;

  const notices = await Notice.find(
    { owner: userId },
    "-createdAt -updatedAt",
    {
      skip,
      limit,
    }
  );

  res.status(200).json({ notices });
};
const getAllNotices = async (req, res) => {
  const { _id: owner } = req.user;
  const { page, limit } = req.query;
  const skip = (page - 1) * limit;
  const notices = await Notice.find({}, "-createdAt -updatedAt", {
    skip,
    limit,
  });
  res.status(200).json(notices);
};

module.exports = {
  getUserByNotices,
  getNoticeByCategory,
  createNotice,
  addNoticeFavorite,
  getUserByFavorite,
  deleteNoticeFavorite,
  deleteUserNotice,
  getAllNotices,
};
