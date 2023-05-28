const { Notice } = require("../../models/notice");
const { User } = require("../../models/userSchema");
const { HttpError } = require("../../helpers/HttpError");
const gravatar = require("gravatar");

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

  const notice = await Notice.create({
    ...req.body,
    avatarURL: noticeAvatarURL,
    owner,
  });

  res.status(200).json({ notice, message: "Successfully" });
};

const addNoticeFavorite = async (req, res, next) => {
  const { _id, favorite } = req.user;

  const { id } = req.params;

  const result = favorite.includes(id);

  if (favorite.includes(result)) {
    throw HttpError(500, "Notice already added to favorites");
  }

  const notice = await User.findByIdAndUpdate(
    _id,
    { $push: { favorite: id } },
    {
      new: true,
    }
  );

  res.status(201).json({ favorite: notice.favorite });
};

const deleteNoticeFavorite = async (req, res, next) => {
  const { _id: userId } = req.user;
  const { id } = req.params;

  const notice = await Notice.findOneAndUpdate(
    { _id: id, favorite: userId },
    { $pull: { favorite: userId } }
  );

  if (!notice) {
    throw HttpError(500, "The notice is not in the favorites");
  }

  res.status(200).json({ message: "Successfully removed from favorites" });
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

const getNoticeById = async (req, res) => {
  const { id } = req.params;

  const notice = await Notice.findById({ _id: id });

  if (!notice) {
    throw HttpError(404, "Not found");
  }

  res.status(200).json(notice);
};

const getNoticeByCategory = async (req, res) => {
  const { categoryName: category } = req.params;
  const { query } = req.query;

  if (query && category) {
    const notices = await Notice.find({ query, category });
    res.status(200).json(notices);
  } else if (query) {
    const notices = await Notice.find({ query });
    res.status(200).json(notices);
  } else if (category) {
    const notices = await Notice.find({ category });
    res.status(200).json(notices);
  } else {
    res.status(400).json({ error: "No search parameters provided" });
  }
};

const getUserByFavorite = async (req, res) => {
  const { _id: userId } = req.user;
  const { title } = req.query;

  let notices;

  if (title) {
    notices = await User.find({
      favorite: { $in: userId },
      title: title,
    });
  } else {
    notices = await User.find({
      favorite: { $in: userId },
    });
  }

  res.status(200).json({ notices });
};

const getUserByNotices = async (req, res) => {
  const { _id: userId } = req.user;

  const notices = await Notice.find({ owner: userId });

  res.status(200).json({ notices });
};

const findUserByTitle = async (req, res) => {
  const { title } = req.params;
  const { _id: userId } = req.user;

  const notices = await Notice.find({
    owner: userId,
    title: { $regex: new RegExp(title, "i") },
  });

  res.status(200).json({ notices });
};

module.exports = {
  getUserByNotices,
  getNoticeById,
  getNoticeByCategory,
  createNotice,
  addNoticeFavorite,
  getUserByFavorite,
  findUserByTitle,
  deleteNoticeFavorite,
  deleteUserNotice,
};
