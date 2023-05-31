const uploadCloudinary = require("../../helpers/uploadCloudinary");
const { Pet } = require("../../models/petSchema");
// const gravatar = require("gravatar");

const { HttpError } = require("../../helpers");

const addPet = async (req, res) => {
  const { name, birthday, breed, comments, category, image } = req.body;
  if (!req.file) {
    if (!name) {
      throw HttpError(400, "missing required name field");
    }
    const { _id: ownerId } = req.user;
    const checkName = await Pet.findOne({ name: name });
    if (checkName) {
      throw HttpError(400, "This name is already in use");
    }
    const result = await Pet.create({ ...req.body, owner: ownerId });

    res.status(201).json(result);
  } else {
    const image = await uploadCloudinary(req.file.path);
    const petAvatar = await Pet.create({
      ...req.body,
      image: image.secure_url,
      owner: ownerId,
    });
    res.status(201).json(petAvatar);
  }
};

module.exports = addPet;
