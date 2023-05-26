const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");

const { HttpError, ctrlWrapper } = require("../../helpers");
const path = require("path");

const { User } = require("../../models/userSchema");

require("dotenv").config();
const { SECRET_KEY, BASE_URL } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { name, email, password, city, phone, birthday } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "This email is already in use");
  }

  if (!email) {
    res.status(400).json({ message: "missing required field email" });
  }

  const createHashPassword = await bcrypt.hash(password, 10);
  const avatarUrl = gravatar.url(email);

  const newUser = await User.create({
    ...req.body,
    password: createHashPassword,
    avatarUrl,
  });

  res.status(201).json({
    user: {
      name: newUser.name,
      email: newUser.email,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };
  require("dotenv").config();
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "12h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    token,
    message: "Your request has been successfully completed",
  });
};

const getCurrent = async (req, res) => {
  const { name, email, phone, city, birthday, avatarURL, _id } = req.user;

  res.status(201).json({
    avatarURL,
    name,
    email,
    birthday,
    phone,
    city,
    _id,
    message: "Your request has been successfully completed",
  });
};

const updateFieldUser = async (req, res) => {
  const { name, email, phone, city, birthday, avatarURL } = req.body;
  // const { userId } = req.params;
  const { _id: userId } = req.user;

  if (!name && !email && !phone && !city && !birthday) {
    throw HttpError(400, "missing fields");
  }
  const result = await User.findOneAndUpdate({ ...req.body, owner: userId });

  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const logout = async (req, res) => {
  const { _id } = req.user;
  const result = await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204, "logout success").json(result);
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  updateFieldUser: ctrlWrapper(updateFieldUser),
  logout: ctrlWrapper(logout),
};
