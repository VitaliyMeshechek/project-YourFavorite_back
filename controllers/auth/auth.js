const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");

const { HttpError, ctrlWrapper } = require("../../helpers");
const path = require("path");

const { User } = require("../../models/userSchema");
const { Pet } = require("../../models/petSchema");

require("dotenv").config();
const { SECRET_KEY, BASE_URL } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const userFindEmail = await User.findOne({ email });
  if (userFindEmail) {
    throw HttpError(409, "This email is already in use");
  }

  if (!email) {
    res.status(400).json({ message: "missing required field email" });
  }

  if (!req.body) {
    res.status(401).json({ message: "You need to register" });
  }

  const createHashPassword = await bcrypt.hash(password, 10);
  // const avatarUrl = gravatar.url(email);

  const user = await User.create({
    ...req.body,
    password: createHashPassword,
  });

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "12h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.status(201).json({
    user: {
      name: user.name,
      email: user.email,
    },
    token,
  });
};

const login = async (req, res) => {
  const { name, email, password, avatarUrl, firstLogin } = req.body;
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

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "12h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    user: {
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      birthday: user.birthday,
      city: user.city,
      phone: user.phone,
      firstLogin: user.firstLogin,
    },
    token,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  const result = await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204, "logout success").json(result);
};

const getCurrentUser = async (req, res) => {
  const { name, email, phone, city, birthday, avatarUrl } = req.user;
  if (req.user) {
    res.status(200).json({
      user: {
        email,
        name,
        avatarUrl,
        birthday,
        city,
        phone,
      },
    });
  }
};

const getFindUsers = async (req, res) => {
  const { name, email, phone } = req.user;
  const { id } = req.params;
  if (!id) {
    res.status(404).json({ message: "No data found" });
  }
  const findUser = await Pet.findById(id);

  res.status(200).json({
    findUser: {
      name: findUser.name,
      email: findUser.email,
      phone: findUser.phone,
    },
  });
};

// const getCurrentUser = async (req, res) => {
//   const user = await User.find();
//   res.status(200).json(user);
// };

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrentUser: ctrlWrapper(getCurrentUser),
  getFindUsers: ctrlWrapper(getFindUsers),
  logout: ctrlWrapper(logout),
};
