const express = require("express");
const router = express.Router();

const ctrl = require("../../controllers/sponsors");

const { validateBody, authenticate } = require("../../middlewares");

const { schemas } = require("../../models/sponsorsSchema");

router.post(
  "/",
  authenticate,
  validateBody(schemas.addSponsorsSchema),
  ctrl.addSponsors
);

module.exports = router;
