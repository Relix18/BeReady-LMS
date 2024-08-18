import { User } from "../models/user.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from "../middlewares/error.js";
import { accessTokenOption, activationToken, refreshTokenOption, sendToken, } from "../utils/jwtToken.js";
import jwt from "jsonwebtoken";
import { redis } from "../data/redis.js";
import { v2 as cloudinary } from "cloudinary";
export const register = TryCatch(async (req, res, next) => {
    const { name, email, password, avatar } = req.body;
    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
        return next(new ErrorHandler(400, "Email already exists"));
    }
    const user = {
        name,
        email,
        password,
        avatar,
    };
    const { token, activationCode } = activationToken(user);
    const option = {
        expires: new Date(Date.now() + 5 * 60 * 1000),
        httpOnly: true,
    };
    try {
        // await sendEmail({
        //   email: user.email,
        //   subject: "Activate your account",
        //   message: `This is your activation code ${activationCode}`,
        // });
        // res.status(201).json({
        //   success: true,
        //   message: `Email sent to ${user.email} successfully`,
        //   token,
        // });
        res
            .status(201)
            .cookie("activation", token, option)
            .json({ success: true, token, activationCode });
    }
    catch (error) {
        return next(new ErrorHandler(400, error.message));
    }
});
export const activateUser = TryCatch(async (req, res, next) => {
    const { activationCode } = req.body;
    const { activation } = req.cookies;
    if (!activation) {
        return next(new ErrorHandler(400, "Activation code expired. Try again"));
    }
    const newUser = jwt.verify(activation, process.env.JWT_SECRET);
    if (newUser.activationCode !== activationCode) {
        return next(new ErrorHandler(400, "Invalid activation code"));
    }
    res.cookie("activation", "", { expires: new Date() });
    const { name, email, password } = newUser.user;
    const existUser = await User.findOne({ email });
    if (existUser) {
        return next(new ErrorHandler(400, "User already exists"));
    }
    await User.create({ name, email, password });
    res.status(200).json({
        success: true,
        message: "Account activated successfully",
    });
});
export const login = TryCatch(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler(400, "Please enter email and password"));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler(400, "Invalid email or password"));
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return next(new ErrorHandler(400, "Invalid email or password"));
    }
    sendToken(user, 200, res);
});
//Logout User
export const logout = TryCatch(async (req, res, next) => {
    res.cookie("access_token", "", {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.cookie("refresh_token", "", {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    redis.del(req.user?._id);
    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
});
//update access token
export const updateAccessToken = TryCatch(async (req, res, next) => {
    const refresh_token = req.cookies.refresh_token;
    const decoded = jwt.verify(refresh_token, process.env.REFRESH_SECRET);
    if (!decoded) {
        return next(new ErrorHandler(400, "Cannot refresh access token"));
    }
    const session = await redis.get(decoded.id);
    if (!session) {
        return next(new ErrorHandler(400, "Please login to access this resource"));
    }
    const user = JSON.parse(session);
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "5m",
    });
    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_SECRET, {
        expiresIn: "7d",
    });
    req.user = user;
    res.cookie("access_token", accessToken, accessTokenOption);
    res.cookie("refresh_token", refreshToken, refreshTokenOption);
    await redis.set(user._id, JSON.stringify(user), "EX", 604800);
    next();
});
//get user by id
export const getUserById = TryCatch(async (req, res, next) => {
    const id = req.user?._id;
    const userJson = await redis.get(id);
    if (!userJson) {
        return next(new ErrorHandler(404, "User not found"));
    }
    const user = JSON.parse(userJson);
    res.status(200).json({ success: true, user });
});
//social auth
export const socialAuth = TryCatch(async (req, res, next) => {
    const { email, name, avatar } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        const newUser = new User({
            name,
            email,
            avatar,
        });
        await newUser.save();
        sendToken(newUser, 201, res);
    }
    else {
        sendToken(user, 200, res);
    }
});
export const updateProfile = TryCatch(async (req, res, next) => {
    const id = req.user?._id;
    const { name, email } = req.body;
    const user = await User.findById(id);
    if (email && user) {
        const isEmailExist = await User.findOne({ email });
        if (isEmailExist) {
            return next(new ErrorHandler(400, "Email already exists"));
        }
        user.email = email;
    }
    if (name && user) {
        user.name = name;
    }
    await user?.save();
    await redis.set(id, JSON.stringify(user));
    res.status(200).json({ success: true, user });
});
export const updatePassword = TryCatch(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const id = req.user?._id;
    const user = await User.findById(id).select("+password");
    if (!oldPassword || !newPassword) {
        return next(new ErrorHandler(400, "Please enter old and new password"));
    }
    if (user?.password === undefined) {
        return next(new ErrorHandler(400, "Invalid user"));
    }
    if (!user) {
        return next(new ErrorHandler(404, "User not found"));
    }
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
        return next(new ErrorHandler(400, "Old password is incorrect"));
    }
    user.password = newPassword;
    await user.save();
    await redis.set(id, JSON.stringify(user));
    res
        .status(200)
        .json({ success: true, message: "Password updated successfully" });
});
//update user avatar
export const updateAvatar = TryCatch(async (req, res, next) => {
    const id = req.user?._id;
    const { avatar } = req.body;
    const user = await User.findById(id);
    if (!avatar) {
        return next(new ErrorHandler(400, "Please upload image"));
    }
    if (avatar && user) {
        if (user?.avatar?.public_id) {
            await cloudinary.uploader.destroy(user.avatar?.public_id);
            const myCloud = await cloudinary.uploader.upload(avatar, {
                folder: "avatars",
                width: 150,
                crop: "scale",
            });
            user.avatar = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        else {
            const myCloud = await cloudinary.uploader.upload(avatar, {
                folder: "avatars",
                width: 150,
                crop: "scale",
            });
            user.avatar = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
    }
    await user?.save();
    await redis.set(id, JSON.stringify(user));
    res.status(200).json({ success: true, user });
});
//get all user --admin
export const getAllUser = TryCatch(async (req, res, next) => {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
});
//update user role --admin
export const updateUserRole = TryCatch(async (req, res, next) => {
    const { id, role } = req.body;
    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorHandler(404, "User not found"));
    }
    user.role = role;
    await user.save();
    res.status(200).json({ success: true, user });
});
//delete user --admin
export const deleteUser = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorHandler(404, "User not found"));
    }
    await user.deleteOne();
    await redis.del(id);
    res
        .status(200)
        .json({ success: true, message: "User deleted successfully" });
});
