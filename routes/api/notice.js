const express = require("express");
const router = express.Router();

const { ctrlWrapper } = require("../../helpers");
const {
  validateBody,
  isValidId,
  authenticate,
  upload,
} = require("../../middlewares");
const { noticesSchema } = require("../../models/notice");
const {
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
} = require("../../controllers/auth/notice");

router.get("/", authenticate, ctrlWrapper(getUserByNotices));
router.get("/:id", isValidId, ctrlWrapper(getNoticeById));
router.get("/category/:category", ctrlWrapper(getNoticeByCategory));
router.get("/title/:title", authenticate, ctrlWrapper(findUserByTitle));
router.get("/title/:category/:title", ctrlWrapper(getNoticeByTitle));
router.get("/user/favorites", authenticate, ctrlWrapper(getUserByFavorite));
router.get(
  "/user/favorites/title/:title",
  authenticate,
  ctrlWrapper(findFavoriteByTitle)
);

router.post(
  "/",
  authenticate,
  upload.single("image"),
  validateBody(noticesSchema),
  ctrlWrapper(createNotice)
);
router.post(
  "/favorites/:id",
  isValidId,
  authenticate,
  ctrlWrapper(addNoticeFavorite)
);

router.delete(
  "/favorites/:id",
  isValidId,
  authenticate,
  ctrlWrapper(deleteNoticeFavorite)
);
router.delete("/:id", isValidId, authenticate, ctrlWrapper(deleteUserNotice));

module.exports = router;
