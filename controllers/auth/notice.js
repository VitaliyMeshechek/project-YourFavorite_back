const { Notice } = require("../../models/notice");
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
  const { _id: userId } = req.user;

  const { id } = req.params;

  const { favorite } = await Notice.findOne({ _id: id });

  if (favorite.includes(userId)) {
    throw HttpError(500, "Notice already added to favorites");
  }

  const notice = await Notice.findOneAndUpdate(
    { _id: id },
    { $addToSet: { favorite: userId } }
  );

  res.status(200).json({
    userId: userId,
    noticeId: notice._id,
    message: "Successfully",
  });
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

const getNoticeByTitle = async (req, res) => {
  const { category, title } = req.params;

  const notices = await Notice.find({
    category,
    title: { $regex: new RegExp(title, "i") },
  });

  res.status(200).json({ notices });
};

const getNoticeByCategory = async (req, res) => {
  const { category } = req.params;

  const notices = await Notice.find({ category });

  res.status(200).json({ notices });
};

const getUserByFavorite = async (req, res) => {
  const { _id: userId } = req.user;

  const notices = await Notice.find({
    favorite: { $in: userId },
  });

  res.status(200).json({ notices });
};

const getUserByNotices = async (req, res) => {
  const { _id: userId } = req.user;

  const notices = await Notice.find({ owner: userId });

  res.status(200).json({ notices });
};

const findFavoriteByTitle = async (req, res) => {
  const { title } = req.params;
  const { _id: userId } = req.user;

  const notices = await Notice.find({
    favorite: { $in: userId },
    title: { $regex: new RegExp(title, "i") },
  });

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
  getNoticeByTitle,
  getUserByFavorite,
  findFavoriteByTitle,
  findUserByTitle,
  deleteNoticeFavorite,
  deleteUserNotice,
};
