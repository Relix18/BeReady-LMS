import { Request, Response, NextFunction } from "express";
import { IUser, User } from "../models/user.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from "../middlewares/error.js";
import { activationToken, sendToken } from "../utils/jwtToken.js";
import sendEmail from "../utils/sendMail.js";
import jwt from "jsonwebtoken";
import { redis } from "../data/redis.js";

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
