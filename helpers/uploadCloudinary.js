const cloudinary = require("cloudinary").v2;
const { CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET } = process.env;
const Jimp = require("jimp");
const fs = require("fs");

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_KEY,
  api_secret: CLOUDINARY_SECRET,
  secure: true,
});

const uploadCloudinary = async (path) => {
  try {
    const resultUpload = await Jimp.read(path);
    resultUpload.cover(450, 450);
    await resultUpload.writeAsync(path);
    const result = await cloudinary.uploader.upload(path);
    fs.unlinkSync(path);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = uploadCloudinary;
