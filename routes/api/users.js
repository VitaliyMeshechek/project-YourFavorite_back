const express = require("express");
const router = express.Router();

const ctrl = require("../../controllers/auth/auth");

const { validateBody, authenticate } = require("../../middlewares");

const { schemas } = require("../../models/userSchema");

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

router.get("/current", authenticate, ctrl.getCurrentUser);

router.get("/:id", authenticate, ctrl.getFindUsers);

router.post("/logout", authenticate, ctrl.logout);

module.exports = router;
