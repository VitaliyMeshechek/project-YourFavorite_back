const { Notice } = require("../../models/notice");
const { HttpError } = require("../../helpers/HttpError");
const gravatar = require("gravatar");
const { User } = require("../../models/userSchema");
const { not } = require("joi");

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

  const { body } = req;

  const { favorite } = await Notice.findOne({ _id: id });

  if (favorite.includes(userId)) {
    throw HttpError(500, "Notice already added to favorites");
  }

  const notice = await Notice.findOneAndUpdate(
    { _id: id },
    { $push: { favorite: { userId, body } } }
  );

  res.status(200).json({
    favorite: notice.favorite,
    message: "Success",
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
  const { categoryName: category, id } = req.params;
  const { query, page, limit } = req.query;
  const skip = (page - 1) * limit;
  if (!query && !category) {
    const allNotices = await Notice.find(
      {},
      "-createdAt -updatedAt -idCloudAvatar",
      {
        skip,
        limit,
      }
    );
    res.status(200).json(allNotices);
  } else if (category && !query && !id) {
    const noticesByCategory = await Notice.find(
      { category },
      "-createdAt -updatedAt -idCloudAvatar",
      {
        skip,
        limit,
      }
    );
    res.status(200).json(noticesByCategory);
  } else if (category && query && !id) {
    const notices = await Notice.find(
      { query, category },
      "-createdAt -updatedAt -idCloudAvatar",
      {
        skip,
        limit,
      }
    );
    res.status(200).json(notices);
  } else if (category && query && id) {
    const notices = await Notice.find(
      { query, category, _id: id },
      "-createdAt -updatedAt -idCloudAvatar",
      {
        skip,
        limit,
      }
    );
    res.status(200).json(notices);
  } else if (id) {
    const notice = await Notice.findById(
      id,
      "-createdAt -updatedAt -idCloudAvatar",
      {
        skip,
        limit,
      }
    );
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
    notices = await User.find({
      favorite: { owner: userId },
      title: title,
    });
  } else {
    notices = await User.find({
      favorite: { owner: userId },
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
