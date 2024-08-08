import { Request, Response, NextFunction } from "express";
import { IUser, User } from "../models/user.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from "../middlewares/error.js";
import {
  accessTokenOption,
  activationToken,
  refreshTokenOption,
  sendToken,
} from "../utils/jwtToken.js";
import sendEmail from "../utils/sendMail.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../data/redis.js";
import { v2 as cloudinary } from "cloudinary";

interface IRegistration {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const register = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, avatar } = req.body as IRegistration;

    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      return next(new ErrorHandler(400, "Email already exists"));
    }

    const user: IRegistration = {
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
    } catch (error: any) {
      return next(new ErrorHandler(400, error.message));
    }
  }
);

export const activateUser = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { activationCode } = req.body;
    const { activation } = req.cookies;

    const newUser: { user: IUser; activationCode: string } = jwt.verify(
      activation,
      process.env.JWT_SECRET as string
    ) as { user: IUser; activationCode: string };

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
  }
);

//Login User

interface ILogin {
  email: string;
  password: string;
}

export const login = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as ILogin;
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
  }
);

//Logout User

export const logout = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    res.cookie("access_token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.cookie("refresh_token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    redis.del(req.user?._id as string);

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  }
);

//update access token

export const updateAccessToken = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const refresh_token = req.cookies.refresh_token;
    const decoded = jwt.verify(
      refresh_token,
      process.env.REFRESH_SECRET as string
    ) as JwtPayload;

    if (!decoded) {
      return next(new ErrorHandler(400, "Cannot refresh access token"));
    }
    const session = await redis.get(decoded.id);
    if (!session) {
      return next(
        new ErrorHandler(400, "Please login to access this resource")
      );
    }

    const user = JSON.parse(session);
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "5m",
      }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    req.user = user;

    res.cookie("access_token", accessToken, accessTokenOption);
    res.cookie("refresh_token", refreshToken, refreshTokenOption);

    await redis.set(user._id, JSON.stringify(user), "EX", 604800);

    res.status(200).json({ success: true, accessToken });
  }
);

//get user by id

export const getUserById = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?._id;
    const userJson = await redis.get(id as string);

    if (!userJson) {
      return next(new ErrorHandler(404, "User not found"));
    }
    const user = JSON.parse(userJson);
    res.status(200).json({ success: true, user });
  }
);

interface ISocialAuth {
  name: string;
  email: string;
  avatar: string;
}

//social auth
export const socialAuth = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, name, avatar } = req.body as ISocialAuth;
    const user = await User.findOne({ email });
    if (!user) {
      const newUser = new User({
        name,
        email,
        avatar,
      });
      await newUser.save();
      sendToken(newUser, 201, res);
    } else {
      sendToken(user, 200, res);
    }
  }
);

//update user profile
interface IUpdateProfile {
  name?: string;
  email?: string;
}

export const updateProfile = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?._id;
    const { name, email } = req.body as IUpdateProfile;
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

    await redis.set(id as string, JSON.stringify(user));

    res.status(200).json({ success: true, user });
  }
);

//update user password
interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export const updatePassword = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword } = req.body as IUpdatePassword;
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
    await redis.set(id as string, JSON.stringify(user));
    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  }
);

//update user avatar

export const updateAvatar = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
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
      } else {
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

    await redis.set(id as string, JSON.stringify(user));
    res.status(200).json({ success: true, user });
  }
);

//get all user --admin
export const getAllUser = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  }
);

//update user role --admin
export const updateUserRole = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, role } = req.body;
    const user = await User.findById(id);

    if (!user) {
      return next(new ErrorHandler(404, "User not found"));
    }
    user.role = role;
    await user.save();
    res.status(200).json({ success: true, user });
  }
);

//delete user --admin
export const deleteUser = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return next(new ErrorHandler(404, "User not found"));
    }
    await user.deleteOne();
    await redis.del(id as string);

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  }
);
