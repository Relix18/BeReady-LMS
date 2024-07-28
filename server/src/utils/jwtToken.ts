import { Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { IUser } from "../models/user.model";
import { redis } from "../data/redis.js";

interface IOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "none" | "lax" | "strict" | "none";
  secure?: boolean;
}

const tokenExpire = parseInt(process.env.COOKIE_EXPIRE || "300", 10);
const refreshExpire = parseInt(process.env.REFRESH_EXPIRE || "1200", 10);

export const accessTokenOption: IOptions = {
  expires: new Date(Date.now() + tokenExpire * 60 * 1000),
  maxAge: tokenExpire * 1000,
  httpOnly: true,
  sameSite: "lax",
};

export const refreshTokenOption: IOptions = {
  expires: new Date(Date.now() + refreshExpire * 1000),
  maxAge: refreshExpire * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const token = user.getJWTToken();
  const refreshToken = user.signRefreshToken();

  redis.set(user._id, JSON.stringify(user) as any);

  if (process.env.NODE_ENV === "production") {
    accessTokenOption.secure = true;
    refreshTokenOption.secure = true;
  }

  res.cookie("access_token", token, accessTokenOption);
  res.cookie("refresh_token", refreshToken, refreshTokenOption);

  res.status(statusCode).json({
    success: true,
    user,
    token,
  });
};

interface IActivation {
  token: string;
  activationCode: string;
}

export const activationToken = (user: any): IActivation => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign(
    { user, activationCode },
    process.env.JWT_SECRET as Secret,
    {
      expiresIn: "5m",
    }
  );
  return { token, activationCode };
};
