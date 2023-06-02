const { uploadCloudinary } = require("../../helpers/uploadCloudinary");
const { User } = require("../../models/userSchema");
// const gravatar = require("gravatar");

const { HttpError } = require("../../helpers");

const updateFieldUser = async (req, res) => {
  const { name, email, phone, city, birthday, firstLogin, image, avatarUrl } =
    req.body;
  const { _id } = req.user;
  //   const { id } = req.params;
  if (!req.file) {
    const user = await User.findByIdAndUpdate(
      _id,
      { ...req.body },
      {
        new: true,
      }
    );
    res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
        city: user.city,
        phone: user.phone,
        birthday: user.birthday,
        firstLogin: user.firstLogin,
      },
    });
  } else {
    const userCurrent = await User.findOneAndUpdate(
      _id,
      { ...req.body, avatarUrl: req.file.path },
      {
        new: true,
      }
    );

    res.status(200).json({
      userCurrent,
    });
  }
};

module.exports = updateFieldUser;
