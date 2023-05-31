const { Schema, model } = require("mongoose");
const Joi = require("joi");
const nameFormat = /^([A-Za-z\-\']{1,20})|([А-Яа-я\-\']{1,20})$/;
const dateFormat =
  /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/;
// eslint-disable-next-line no-useless-escape
const textFormat = /^([A-Za-z\-\']{1,200})|([А-Яа-я\-\']{1,200})$/;

const { handleMongooseError } = require("../helpers");

const petSchema = new Schema(
  {
    name: {
      type: String,
      match: nameFormat,
      required: true,
    },
    birthday: {
      type: String,
      match: dateFormat,
      required: true,
      default: null,
    },
    breed: {
      type: String,
      match: nameFormat,
      required: true,
      default: null,
    },
    avatarUrl: {
      type: String,
      default: null,
      // required: true,
    },
    comments: {
      type: String,
      match: textFormat,
      default: null,
      required: true,
    },
    category: {
      type: String,
      enum: ["your pet", "sell", "lost/found", "in good hands"],
      default: null,
    },
    firstLogin: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

petSchema.post("save", handleMongooseError);

const petAddSchema = Joi.object({
  name: Joi.string().pattern(nameFormat),
  birthday: Joi.string().pattern(dateFormat),
  breed: Joi.string().pattern(nameFormat),
  comments: Joi.string().min(10).max(120).pattern(textFormat),
  avatarURL: Joi.string().optional(),
  category: Joi.string().optional(),
  firstLogin: Joi.boolean(),
});

const petSchemas = {
  petAddSchema,
};

const Pet = model("pet", petSchema);

module.exports = {
  Pet,
  petSchemas,
};
