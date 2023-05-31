// const cloudinary = require("cloudinary").v2;
// const { CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET } = process.env;
// const Jimp = require("jimp");
// const fs = require("fs");

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// cloudinary.config({
//   cloud_name: CLOUDINARY_NAME,
//   api_key: CLOUDINARY_KEY,
//   api_secret: CLOUDINARY_SECRET,
//   secure: true,
// });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// const uploadCloudinary = async (path) => {
//   try {
//     const resultUpload = await Jimp.read(path);
//     resultUpload.cover(450, 450);
//     await resultUpload.writeAsync(path);
//     const result = await cloudinary.uploader.upload(path);
//     fs.unlinkSync(path);
//     return result;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

// module.exports = uploadCloudinary;

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: "avatars",
  allowedFormats: ["jpg", "png"],
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;
