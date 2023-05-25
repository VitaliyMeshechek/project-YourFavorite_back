const express = require("express");

const ctrl = require("../../controllers/auth/auth");

const { validateBody, authenticate } = require("../../middlewares");

const { schemas } = require("../../models/user");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

router.get("/current", authenticate, ctrl.getCurrent);

router.put(
  "/current/:userId",
  authenticate,
  validateBody(schemas.updateUserSchema),
  ctrl.updateFieldUser
);

router.post("/logout", authenticate, ctrl.logout);

module.exports = router;
