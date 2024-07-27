import { Response } from "express";
import jwt, { Secret } from "jsonwebtoken";

interface IRegistration {
  name?: string;
  email: string;
  password: string;
  avatar?: string;
  getJWTToken(): string;
}

export const sendToken = (
  user: IRegistration,
  statusCode: number,
  res: Response
) => {
  const token = user.getJWTToken();

  const option = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res.status(statusCode).cookie("token", token, option).json({
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
