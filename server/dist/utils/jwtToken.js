import jwt from "jsonwebtoken";
import { redis } from "../data/redis.js";
const tokenExpire = parseInt(process.env.COOKIE_EXPIRE || "300", 10);
const refreshExpire = parseInt(process.env.REFRESH_EXPIRE || "1200", 10);
export const accessTokenOption = {
    expires: new Date(Date.now() + tokenExpire * 60 * 1000),
    maxAge: tokenExpire * 1000,
    httpOnly: true,
    sameSite: "lax",
};
export const refreshTokenOption = {
    expires: new Date(Date.now() + refreshExpire * 1000),
    maxAge: refreshExpire * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
};
export const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();
    const refreshToken = user.signRefreshToken();
    redis.set(user._id, JSON.stringify(user));
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
export const activationToken = (user) => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jwt.sign({ user, activationCode }, process.env.JWT_SECRET, {
        expiresIn: "5m",
    });
    return { token, activationCode };
};
