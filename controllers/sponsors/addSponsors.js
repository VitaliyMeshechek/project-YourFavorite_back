const { nanoid } = require("nanoid");

const fs = require("fs").promises;
// const path = require("path");
// const sponsorsPath = path.join(__dirname, "../../sponsors.json");

const { HttpError, ctrlWrapper } = require("../../helpers");

const { Sponsor } = require("../../models/sponsorsSchema");

async function listSponsors() {
  const data = await fs.readFile(sponsorsPath, "utf-8");
  return JSON.parse(data);
}

// const addSponsors = async (req, res) => {
//   const { title, url, addressUrl, imageUrl, workDays, phone, email } = req.body;

//   if (!title) {
//     throw HttpError(400, "missing required title field");
//   }

//   const checktitle = await Sponsor.findOne({ title: title });
//   if (checktitle) {
//     throw HttpError(400, "This title is already in use");
//   }

//   const result = await Sponsor.create({ ...req.body });

//   res.status(201).json(result);
// };

module.exports = addSponsors;
