const { Schema, model } = require("mongoose");

const Joi = require("joi");

const { handleMongooseError } = require("..//helpers");

// eslint-disable-next-line no-useless-escape
const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
    {
        password: {
            type: String,
            minlength: 6,
            required: [true, 'Set password for user'],
          },
          email: {
            type: String,
            required: [true, 'Email is required'],
            match: emailFormat, 
            unique: true,
          },
          subscription: {
            type: String,
            enum: ["starter", "pro", "business"],
            default: "starter"
          },
          token: String,
          avatarUrl: {
            type: String,
            required: true,
          },
          verify: {
            type: Boolean,
            default: false,
          },
          verificationToken: {
            type: String,
            default: "",
            required: [true, 'Verify token is required'],
          }
    },
    { versionKey: false, timestamps: true }
  );

  userSchema.post("save", handleMongooseError);

  const registerSchema = Joi.object({
    password: Joi.string().min(6).required(),
    email: Joi.string().pattern(emailFormat, "match the input format. Example of input: ivanov@gmail.com").email({
        minDomainSegments: 2,
        tlds: {allow: ["com", "net", "ukr", "ua"]},
      }),
    subscription: Joi.string().required().valid("starter", "pro", "business"),
  });

  const emailSchema = Joi.object({
    email: Joi.string().required().pattern(emailFormat, "match the input format. Example of input: ivanov@gmail.com").email({
        minDomainSegments: 2,
        tlds: {allow: ["com", "net", "ukr", "ua"]},
      }),
  });

  const loginSchema = Joi.object({
    password: Joi.string().min(6).required(),
    email: Joi.string().required().pattern(emailFormat, "match the input format. Example of input: ivanov@gmail.com"),
  });

  const schemas = {
    registerSchema,
    emailSchema,
    loginSchema,
  };

  const User = model("user", userSchema);

module.exports = {
  User,
  schemas,
  userSchema,
};