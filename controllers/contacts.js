const { HttpError, ctrlWrapper } = require("..//helpers");

const { Contact } = require("..//models/contact");

const getAllContacts = async (req, res) => {
  const {_id: ownerId} = req.user;
  const {page, limit} = req.query;
  const skip = (page - 1) * limit;
  const result = await Contact.find({owner: ownerId}, "-createdAt -updatedAt", {skip, limit});
  res.json(result);
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const {_id: ownerId} = req.user;
  //  const result = await Contact.findOne({_id: contactId});
  const result = await Contact.findOne({_id: contactId, owner: ownerId});
  if (!result) {
    res.status(404, "Not found");
  }
  res.json(result);
};

const addContact = async (req, res) => {
  const { name, email, phone} = req.body;

  if (!name) {
    throw HttpError(400, "missing required name field");
  }
  const {_id: ownerId} = req.user;
  const checkName = await Contact.findOne({name: name});
  if (checkName) {
    throw HttpError(400, "This name is already in use");
  }
  const checkEmail = await Contact.findOne({email: email});
  if (checkEmail) {
    throw HttpError(400, "This email is already in use");
  }
  const checkPhone = await Contact.findOne({phone: phone});
  if (checkPhone) {
    throw HttpError(400, "This phone is already in use");
  }
  const result = await Contact.create({...req.body, owner: ownerId});

  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  const { name, email, phone } = req.body;
  const { contactId } = req.params;
  const {_id: ownerId} = req.user;

  if (!name && !email && !phone) {
    throw HttpError(400, "missing fields");
  }
  const result = await Contact.findOneAndUpdate({_id: contactId, owner: ownerId}, req.body, {new: true});

  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const updateStatusContact = async (req, res) => {
  const { favorite } = req.body;
  const { contactId } = req.params;
  const {_id: ownerId} = req.user;

  if (!favorite) {
    res.status(400, "missing field favorite");
  }
  const result = await Contact.findOneAndUpdate({_id: contactId, owner: ownerId}, req.body, {
    new: true,
  });

  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const {_id: ownerId} = req.user;
  const result = await Contact.findOneAndDelete({_id: contactId, owner: ownerId});
  if (!result) {
    throw HttpError(404, "Not found");
  }
  // res.status(204).send();
  res.json({ message: "Delete success" }).json(result);
};

module.exports = {
  getAllContacts: ctrlWrapper(getAllContacts),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
  deleteContact: ctrlWrapper(deleteContact),
};
