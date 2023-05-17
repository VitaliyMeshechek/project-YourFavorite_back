const Jimp = require("jimp");
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const {nanoid} = require('nanoid');
const { HttpError, ctrlWrapper, sendEmail } = require("..//helpers");
const path = require('path');
const fs = require("fs/promises");
const nodemailer = require('nodemailer');

const {User} = require('../models/user');

require("dotenv").config();

const {SECRET_KEY, BASE_URL} = process.env;

const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');


const register = async(req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if (user) {
        throw HttpError(409, "This email is already in use");
    } 

    if(!email) {
        res.status(400).json({message: "missing required field email"})
    }
    
    const createHashPassword = await bcrypt.hash(password, 10)
    const avatarUrl = gravatar.url(email);
    const verificationToken = nanoid();

    const newUser = await User.create({...req.body, password:createHashPassword, avatarUrl, verificationToken});

    const verifyEmail = {
        to: email,
        subject: "Verify your email",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click verify your email</a>`,
    }

       await sendEmail(verifyEmail);


    res.status(201).json({email: newUser.email, subscription: newUser.subscription});
};

const verifyRouter = async(req, res) => {
    const {verificationToken} = req.params;
    const user = await User.findOne({verificationToken});
    if (!user) {
            throw HttpError(404, "User not found");
        }
        await User.findByIdAndUpdate(user.id, {verify: true, verificationToken: null});
        
        res.json({
            message: "Verification successful"
        })
}

const resendVerifyEmail = async (req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email});
    if (!user) {
        throw HttpError(401, "Email not found");
    }
    if(!email) {
        res.status(400).json({message: "missing required field email"})
    }
    if (user.verify) {
        throw HttpError(400, "Verification has already been passed");
    }
    const verifyEmail = {
        to: email,
        subject: "Verify your email",
        html: `<a target = "_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click verify your email</a>`,
    }

    await sendEmail(verifyEmail)

    res.json({
        message: "Verification email sent"
    })
}

const login = async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }
    if(!user.verify) {
        throw HttpError(401, "Email not verified");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    }

    const payload = {
        id: user._id,
    }
    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "12h"});
    await User.findByIdAndUpdate(user._id, {token});
    

    res.json({
        token,
    })
};

    const getCurrent = async(req, res) => {
        const {email, subscription} = req.user;

        res.json({
            email,
            subscription,
        })
    };

    const logout = async(req, res) => {
        const {_id} = req.user;
        const result = await User.findByIdAndUpdate(_id, {token:""});

        res.status(204, "logout success").json(result);
    };

    const updateAvatar = async(req, res) => {
        const {_id} = req.user;
        const {path: tmp, originalname} = req.file;
        const filename = `${_id}_${originalname}`;
        const resultUpload = path.join(avatarsDir, filename);
        await fs.rename(tmp, resultUpload);
        const avatarUrl = path.join("avatars", filename);


        await Jimp.read(resultUpload)
        .then(img =>{
            return img 
            .resize(250, 250)
            .write(resultUpload);
        })
        .catch((err) => {
            console.error(err);
          });

          await User.findOneAndUpdate({_id, avatarUrl});
          
          res.json({
            avatarUrl,  
        })
    }

module.exports = {
    register: ctrlWrapper(register),
    verifyRouter: ctrlWrapper(verifyRouter),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
};