const express = require("express");
const router = express.Router();

const ctrl = require("../../controllers/pets");

const { ctrlWrapper } = require("../../helpers");

const { petSchemas } = require("../../models/pet");

const { validateBody, authenticate, upload } = require("../../middlewares");

// const { addPet } = require("../../controllers/cardPets/cardPets");

// const { petSchemas } = require("../../models/pet");
// const { userSchemas } = require("../../models/user");

router.post(
  "/pets",
  authenticate,
  validateBody(petSchemas.petAddSchema),
  ctrlWrapper(ctrl.addPet)
);

// // router.post(
// //   "/pets",
// //   authenticate,
// //   upload.single("avatar"),
// //   validateBody(petSchemas),
// //   ctrlWrapper(addPet)
// // );

// router.post(
//   "/",
//   authenticate,
//   validateBody(petSchemas.petAddSchema),
//   ctrlWrapper(addPet)
// );

// // router.delete(
// //   "/pets/:id",
// //   authenticate,
// //   isValidId,
// //   ctrlWrapper(ctrl.removePet)
// // );
// // router.get("/", authenticate, ctrlWrapper(ctrl.getUserInfo));

// // router.patch(
// //   "/",
// //   authenticate,
// //   upload.single("avatar"),
// //   validateBody(userSchemas.updateUserSchema),
// //   ctrlWrapper(ctrl.updateUser)
// // );

module.exports = router;
