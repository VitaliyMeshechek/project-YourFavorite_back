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
  getNoticeByCategory,
  createNotice,
  addNoticeFavorite,
  getUserByFavorite,
  deleteNoticeFavorite,
  deleteUserNotice,
  getAllNotices,
} = require("../../controllers/notice/notice");
router.get("/users", ctrlWrapper(getAllNotices));
router.get("/own", authenticate, ctrlWrapper(getUserByNotices));
router.get("/:categoryName/:id?", ctrlWrapper(getNoticeByCategory));
router.get("/users/favorite", authenticate, ctrlWrapper(getUserByFavorite));

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
