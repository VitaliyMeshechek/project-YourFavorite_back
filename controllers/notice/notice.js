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

const getNoticeByCategory = async (req, res) => {
  const { category } = req.params;
  const { title } = req.query;

  if (title && category) {
    const notices = await Notice.find({ title, category });
    res.status(200).json(notices);
  } else if (title) {
    const notices = await Notice.find({ title });
    res.status(200).json(notices);
  } else if (category) {
    const notices = await Notice.find({ category });
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
  const { title } = req.query;

  let notices;

  if (title) {
    notices = await Notice.find({
      favorite: { $in: userId },
      title: title,
    });
  } else {
    notices = await Notice.find({
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
const getAllNotices = async (req, res) => {
  const notices = await Notice.find();
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
