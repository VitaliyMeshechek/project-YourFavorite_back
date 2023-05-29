const { Schema, model } = require("mongoose");
const Joi = require("joi");

const noticeSchema = new Schema(
  {
    name: {
      type: String,
    },
    title: {
      type: String,
      minlength: 2,
    },
    category: {
      type: String,
      enum: ["in-good-hands", "lost-found", "sell"],
    },
    birthday: {
      type: String,
      default: null,
    },
    location: {
      type: String,
      required: [true, "City/region is required"],
    },
    breed: {
      type: String,
      minlength: 2,
    },
    sex: {
      type: String,
      enum: ["male", "female"],
    },
    comments: {
      type: String,
      minlength: 8,
      maxlength: 200,
    },
    price: {
      type: Number,
    },
    avatarURL: {
      type: String,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      require: true,
    },
  },

  {
    versionKey: false,
  }
);

const noticesSchema = Joi.object({
  name: Joi.string()
    .regex(/^[A-Za-z\s]+$/)
    .trim()
    .min(2)
    .required(),
  title: Joi.string()
    .regex(/^[A-Za-z\s]+$/)
    .trim()
    .min(2)
    .required(),
  category: Joi.string().required(),
  birthday: Joi.string()
    .regex(/^([0-2][1-9]|[1-3]0|31)\.(0[1-9]|1[0-2])\.\d{4}$/)
    .required(),
  location: Joi.string()
    .regex(/^[A-Za-z\s]+,\s[A-Za-z\s]+$/)
    .required(),
  breed: Joi.string()
    .regex(/^[A-Za-z\s]+$/)
    .trim()
    .min(2)
    .required(),
  sex: Joi.string().required(),
  comments: Joi.string().min(2).max(200).required(),
  price: Joi.string().regex(/^(?!0\d)\d+(?:\.\d{1,2})?$/),
  avatarURL: Joi.string(),
});

const Notice = model("notice", noticeSchema);

module.exports = {
  Notice,
  noticesSchema,
};
