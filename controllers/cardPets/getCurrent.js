const { Pet } = require("../../models/petSchema");

const getCurrent = async (req, res) => {
  const {
    name,
    email,
    phone,
    city,
    birthday,
    avatarUrl,
    _id: owner,
  } = req.user;

  const pets = await Pet.find({ owner });

  res.status(201).json({
    user: {
      _id: owner,
      avatarUrl,
      pets: [...pets],
      userCurrent: {
        name,
        email,
        city,
        phone,
        birthday,
        category,
      },
    },
    message: "Your request has been successfully completed",
  });
};

module.exports = getCurrent;
