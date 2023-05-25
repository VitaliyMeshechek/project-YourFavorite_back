const cloudinary = require("cloudinary").v2;
const { CLOUD_NAME, API_KEY, API_SECRET } = process.env;
const fs = require("fs");

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
  secure: true,
});

const updateAvatar = async (avatar) => {
  try {
    const resultUpload = await Jimp.read(avatar);
    resultUpload.cover(450, 450);
    await resultUpload.writeAsync(avatar);
    const result = await cloudinary.uploader.upload(avatar);
    fs.unlinkSync(avatar);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = uploadCloudinary;
