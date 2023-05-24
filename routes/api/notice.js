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
  getUserByFavorite,
  findUserByTitle,
  deleteNoticeFavorite,
  deleteUserNotice,
} = require("../../controllers/notice/notice");

router.get("/", authenticate, ctrlWrapper(getUserByNotices));
router.get("/:id", isValidId, ctrlWrapper(getNoticeById));
router.get("/category/:categoryName", ctrlWrapper(getNoticeByCategory));
router.get("/title/:title", authenticate, ctrlWrapper(findUserByTitle));
router.get("/user/favorite", authenticate, ctrlWrapper(getUserByFavorite));

router.post(
  "/",
  authenticate,
  upload.single("image"),
  validateBody(noticesSchema),
  ctrlWrapper(createNotice)
);
router.post(
  "/favorite/:id",
  isValidId,
  authenticate,
  ctrlWrapper(addNoticeFavorite)
);

router.delete(
  "/favorite/:id",
  isValidId,
  authenticate,
  ctrlWrapper(deleteNoticeFavorite)
);
router.delete("/:id", isValidId, authenticate, ctrlWrapper(deleteUserNotice));

module.exports = router;
