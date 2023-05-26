const express = require("express");
const router = express.Router();

const ctrl = require("../../controllers/cardPets");

const { ctrlWrapper } = require("../../helpers");

const { petSchemas } = require("../../models/petSchema");

const {
  validateBody,
  authenticate,
  isValidId,
  upload,
} = require("../../middlewares");

// const { addPet } = require("../../controllers/cardPets/cardPets");

// const { petSchemas } = require("../../models/pet");
// const { userSchemas } = require("../../models/user");

router.post(
  "/pet",
  authenticate,
  validateBody(petSchemas.petAddSchema),
  upload.single("avatar"),
  ctrlWrapper(ctrl.addPet)
);

// router.post(
//   "/pets",
//   authenticate,
//   upload.single("avatar"),
//   validateBody(petSchemas),
//   ctrlWrapper(addPet)
// );

// router.post(
//   "/",
//   authenticate,
//   validateBody(petSchemas.petAddSchema),
//   ctrlWrapper(addPet)
// );

router.delete("/pet/:id", authenticate, isValidId, ctrlWrapper(ctrl.deletePet));

// router.get("/", authenticate, ctrlWrapper(ctrl.getUserInfo));

// router.patch(
//   "/",
//   authenticate,
//   upload.single("avatar"),
//   validateBody(userSchemas.updateUserSchema),
//   ctrlWrapper(ctrl.updateUser)
// );

module.exports = router;
