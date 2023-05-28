const express = require("express");
const router = express.Router();

const ctrl = require("../../controllers/cardPets");

const { ctrlWrapper } = require("../../helpers");

const { petSchemas } = require("../../models/petSchema");
const { schemas } = require("../../models/userSchema");

const {
  validateBody,
  authenticate,
  isValidId,
  upload,
} = require("../../middlewares");

router.post(
  "/pet",
  authenticate,
  validateBody(petSchemas.petAddSchema),
  upload.single("avatar"),
  ctrlWrapper(ctrl.addPet)
);

router.delete("/pet/:id", authenticate, isValidId, ctrlWrapper(ctrl.deletePet));

router.get("/", authenticate, ctrlWrapper(ctrl.getCurrent));

router.patch(
  "/",
  authenticate,
  upload.single("avatar"),
  validateBody(schemas.updateUserSchema),
  ctrlWrapper(ctrl.updateFieldUser)
);

module.exports = router;
