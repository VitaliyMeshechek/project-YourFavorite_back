const { Pet } = require("../../models/petSchema");

const { HttpError } = require("../../helpers");

const addPet = async (req, res) => {
  const { name, birthday, breed, comments, category, avatarUrl } = req.body;
  const { _id: ownerId } = req.user;
  if (!req.file) {
    if (!name) {
      throw HttpError(400, "missing required name field");
    }
    const checkName = await Pet.findOne({ name: name });
    if (checkName) {
      throw HttpError(400, "This name is already in use");
    }
    const result = await Pet.create({ ...req.body, owner: ownerId });

    res.status(201).json(result);
  } else {
    const petAvatar = await Pet.create({
      ...req.body,
      avatarUrl: req.file.path,
      owner: ownerId,
    });

    res.status(201).json(petAvatar);
  }
};

module.exports = addPet;
