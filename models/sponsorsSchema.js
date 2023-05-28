const { Schema, model } = require("mongoose");

const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

// eslint-disable-next-line no-useless-escape
const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const phoneFormat = /^\+38(0\d{9})$/;

const sponsorsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    addressUrl: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    workDays: [
      {
        isOpen: {
          type: Boolean,
          from: {
            type: Date,
          },
          to: {
            type: Date,
          },
        },
      },
    ],
    phone: {
      type: String,
      match: phoneFormat,
      required: true,
    },
    token: String,
    email: {
      type: String,
      required: true,
      match: emailFormat,
      unique: true,
    },
    verify: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

sponsorsSchema.post("save", handleMongooseError);

const addSponsorsSchema = Joi.object({
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(phoneFormat).required(),
});

const schemas = {
  addSponsorsSchema,
};

const Sponsor = model("sponsor", sponsorsSchema);

module.exports = {
  Sponsor,
  schemas,
  sponsorsSchema,
};
