const { Pet } = require("../../models/pet");

const addPet = async (req, res) => {
  const { _id: ownerId } = req.user;

  if (!req.file) {
    const result = await Pet.create({ ...req.body, owner: ownerId });

    res.status(201).json(result);
  } else {
    const pet = await Pet.create({
      ...req.body,
      avatarURL: avatarURL.secure_url,
      owner: ownerId,
    });
    res.status(201).json(pet);
  }
};

module.exports = addPet;
