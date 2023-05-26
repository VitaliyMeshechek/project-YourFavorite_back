const { Pet } = require("../../models/petSchema");
const { HttpError } = require("../../helpers");

const deletePet = async (req, res) => {
  const { id } = req.params;

  const deletePetById = await Pet.findByIdAndDelete(id);
  if (!deletePetById) {
    throw HttpError(404, `No such animal was found. Check the data`);
  }
  res.status(200).json({
    message: `pet with name ${deletePetById.name} has been deleted`,
  });
};

module.exports = deletePet;
