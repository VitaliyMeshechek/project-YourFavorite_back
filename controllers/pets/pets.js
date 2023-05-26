// const { uploadCloudinary } = require("../../helpers/uploadCloudinary");
const { Pet } = require("../../models/pet");
// const gravatar = require("gravatar");

const { HttpError } = require("../../helpers");

const addPet = async (req, res) => {
  const { name, birthday, breed, avatarURL } = req.body;
  if (!name) {
    throw HttpError(400, "missing required name field");
  }
  const { _id: ownerId } = req.user;
  const checkName = await Pet.findOne({ name: name });
  if (checkName) {
    throw HttpError(400, "This name is already in use");
  }
  // const checkBirthday = await Pet.findOne({ birthday: birthday });
  // if (!checkBirthday) {
  //   throw HttpError(400, "This birthday is already in use");
  // }
  // const checkBreed = await Pet.findOne({ breed: breed });
  // if (!checkBreed) {
  //   throw HttpError(400, "This breed is already in use");
  // }
  // const avatarURL = await uploadCloudinary(req.file.avatar);
  // const checkAvatarURL = await Contact.findOne({avatarURL: avatarURL.secure_url});
  // if (checkAvatarURL) {
  //   throw HttpError(400, "This avatarURL is already in use");
  // }
  // const checkComments = await Pet.findOne({ comments: comments });

  const result = await Pet.create({ ...req.body, owner: ownerId });

  res.status(201).json(result);
};

module.exports = addPet;
