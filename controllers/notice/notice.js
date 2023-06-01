const { Notice } = require("../../models/notice");

const { HttpError } = require("../../helpers/HttpError");
const gravatar = require("gravatar");
const { User } = require("../../models/userSchema");

const createNotice = async (req, res, next) => {
  // let noticeAvatarURL = null;

  // if (req.file) {
  //   const { email } = req.user;
  //   const avatarURL = gravatar.url(email, {
  //     s: "200",
  //     r: "pg",
  //     d: "mm",
  //   });
  //   noticeAvatarURL = avatarURL;
  // }

  const { _id: owner } = req.user;
  const { categoryName } = req.params; // Get the category from req.query instead of req.body

  if (!categoryName) {
    return res.status(400).json({ error: "Category is required" });
  }

  const notice = await Notice.create([
    {
      ...req.body,
      avatarUrl: req.file.path,
      owner,
      category: categoryName, // Include the category in the notice object
    },
  ]);

  res.status(200).json({ notice, message: "Successfully" });
};

const addNoticeFavorite = async (req, res) => {
  const { _id: userId } = req.user;
  const { id } = req.params;

  const notice = await Notice.findOne({ _id: id });

  if (!notice) {
    return res.status(404).json({ message: "Notice not found" });
  }

  const favorite = notice.favorite || [];

  if (favorite.includes(userId)) {
    throw new Error("Notice already added to favorites");
  }

  await User.findByIdAndUpdate(userId, {
    $push: { favorite: { ...notice._doc, id } },
  });

  res.status(200).json({
    favorite: favorite.concat({ userId, ...notice._doc }),
    message: "Success",
  });
};

const deleteNoticeFavorite = async (req, res, next) => {
  const { _id: userId, favorite } = req.user;
  const { id } = req.params;

  const existingNotice = favorite.find((item) => item.id === id);

  if (!existingNotice) {
    return res.status(409).json({
      message: "The notice is not in the favorites",
    });
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $pull: { favorite: { id } } },
    { new: true }
  );

  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    favorite: updatedUser.favorite,
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
  const { query: title, page, limit } = req.query;
  const skip = (page - 1) * limit;
  if (!title && !category) {
    const allNotices = await Notice.find(
      {},
      "-createdAt -updatedAt -idCloudAvatar",
      {
        skip,
        limit,
      }
    );
    res.status(200).json(allNotices);
  } else if (category && !title && !id) {
    const noticesByCategory = await Notice.find(
      { category },
      "-createdAt -updatedAt -idCloudAvatar",
      {
        skip,
        limit,
      }
    );
    res.status(200).json(noticesByCategory);
  } else if (category && title && !id) {
    const regex = new RegExp(title, "i");
    const notices = await Notice.find(
      { category, title: { $regex: regex } },
      "-createdAt -updatedAt -idCloudAvatar",
      {
        skip,
        limit,
      }
    );
    res.status(200).json(notices);
  } else if (category && title && id) {
    const regex = new RegExp(title, "i");
    const notices = await Notice.find(
      { category, title: { $regex: regex }, _id: id },
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
  const notices = await User.findById(userId)
    .populate("favorite")
    .select("favorite");

  res.status(200).json(notices.favorite);
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

  res.status(200).json(notices);
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
