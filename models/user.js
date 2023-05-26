const { Schema, model } = require("mongoose");

const Joi = require("joi");

const { handleMongooseError } = require("..//helpers");

// eslint-disable-next-line no-useless-escape
const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const nameFormat = /^([A-Za-z\-\']{1,20})|([А-Яа-я\-\']{1,20})$/;
const passwordFormat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/;
const dateFormat =
  /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/;
const cityFormat = /^([A-Za-z]+)([,][ ][A-Za-z]+)*$/;
const phoneFormat = /^\+38(0\d{9})$/;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      match: emailFormat,
      unique: true,
    },
    name: {
      type: String,
      match: nameFormat,
      required: true,
    },
    password: {
      type: String,
      match: passwordFormat,
      required: [true, "Set password for user"],
    },
    birthday: {
      type: String,
      match: dateFormat,
      required: true,
    },
    city: {
      type: String,
      match: cityFormat,
      default: "",
    },
    token: String,
    avatarUrl: {
      type: String,
      required: true,
    },
    mobilePhone: {
      type: String,
      match: phoneFormat,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
  name: Joi.string().min(1).max(20).pattern(nameFormat).required(),
  email: Joi.string()
    .required()
    .pattern(
      emailFormat,
      "match the input format. Example of input: ivanov@gmail.com"
    )
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "ukr", "ua"] },
    }),
  password: Joi.string().pattern(passwordFormat).min(6).max(16).required(),
  mobilePhone: Joi.string().pattern(phoneFormat).required(),
  city: Joi.string().pattern(cityFormat).required(),
  birthday: Joi.string().pattern(dateFormat).required(),
});

const emailSchema = Joi.object({
  email: Joi.string()
    .required()
    .pattern(
      emailFormat,
      "match the input format. Example of input: ivanov@gmail.com"
    )
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "ukr", "ua"] },
    }),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .pattern(
      emailFormat,
      "match the input format. Example of input: ivanov@gmail.com"
    ),
  password: Joi.string().min(6).max(16).pattern(passwordFormat).required(),
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(1).pattern(nameFormat).optional(),
  email: Joi.string().pattern(emailFormat).min(10).max(63).optional(),
  birthday: Joi.string().pattern(dateFormat).optional(),
  phone: Joi.string().pattern(phoneFormat).optional(),
  city: Joi.string().pattern(cityFormat).optional(),
  avatarURL: Joi.string().optional(),
});

const schemas = {
  registerSchema,
  emailSchema,
  loginSchema,
  updateUserSchema,
};

const User = model("user", userSchema);

module.exports = {
  User,
  schemas,
  userSchema,
};
