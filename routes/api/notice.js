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
router.get("/", ctrlWrapper(getAllNotices));
router.get("/own", authenticate, ctrlWrapper(getUserByNotices));
router.get("/favorite", authenticate, ctrlWrapper(getUserByFavorite));
router.get("/:categoryName/:id?", ctrlWrapper(getNoticeByCategory));

router.post(
  "/:categoryName",
  authenticate,
  upload.single("avatar"),
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
