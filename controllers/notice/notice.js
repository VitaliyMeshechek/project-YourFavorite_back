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

  if (favorite.includes(id)) {
    throw HttpError(
      409,
      `Notice with id: ${id} is already in your favorite list`
    );
  }

  const user = await User.findByIdAndUpdate(
    _id,
    { $push: { favorite: id } },
    {
      new: true,
    }
  );
  res.status(201).json({ favorite: user.favorite });
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
  const { query = "" } = req.query;

  if (query === "") {
    const notices = await Notice.findOne({ userId }, "favorite").populate({
      path: "favorite",
      select:
        "category title name birthday breed sex location price imageURL comments owner updatedAt",
      // perDocumentLimit: limit,
      // skip,
      options: { limit, skip },
    });
    res.status(200).json(notices.favorite.reverse());
  } else {
    const result = await User.findOne({ userId }, "favorite").populate({
      path: "favorite",
      match: { $text: { $search: query } },
      select:
        "category title name birthday breed sex location price imageURL comments owner updatedAt",
      // perDocumentLimit: limit,
      // skip,
      options: { limit, skip },
    });

    res.status(200).json(result.favorite.reverse());
  }
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
  const notices = await Notice.findOne({ owner }, "-createdAt -updatedAt", {
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
