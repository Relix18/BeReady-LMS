import jwt from "jsonwebtoken";
import { redis } from "../data/redis.js";
export const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();
    const refreshToken = user.signRefreshToken();
    const tokenExpire = parseInt(process.env.COOKIE_EXPIRE || "300", 10);
    const refreshExpire = parseInt(process.env.REFRESH_EXPIRE || "1200", 10);
    redis.set(user._id, JSON.stringify(user));
    const accessTokenOption = {
        expires: new Date(Date.now() + tokenExpire * 1000),
        maxAge: tokenExpire * 1000,
        httpOnly: true,
        sameSite: "lax",
    };
    const refreshTokenOption = {
        expires: new Date(Date.now() + refreshExpire * 1000),
        maxAge: refreshExpire * 1000,
        httpOnly: true,
        sameSite: "lax",
    };
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
