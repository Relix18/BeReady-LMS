import ErrorHanlder from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";
import { redis } from "../data/redis.js";
import { TryCatch } from "../middlewares/error.js";
import { updateAccessToken } from "../controllers/user.controller.js";
import { User } from "../models/user.model.js";
export const isAuthenticated = TryCatch(async (req, res, next) => {
    const access_token = req.cookies.access_token;
    if (!access_token) {
        return next(new ErrorHanlder(400, "Please login to access this resource1"));
    }
    const decoded = jwt.decode(access_token);
    if (!decoded) {
        return next(new ErrorHanlder(400, "Please login to access this resource2"));
    }
    if (decoded.exp && decoded.exp <= Date.now() / 1000) {
        await updateAccessToken(req, res, next);
    }
    else {
        const redisUser = await redis.get(decoded.id);
        const dbUser = await User.findById(decoded.id);
        if (redisUser) {
            req.user = JSON.parse(redisUser);
        }
        else if (dbUser) {
            req.user = dbUser;
            await redis.set(decoded.id, JSON.stringify(dbUser));
        }
        else {
            return next(new ErrorHanlder(400, "Please login to access this resource3"));
        }
        next();
    }
});
//Validate User Role
export const isAuthorized = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return next(new ErrorHanlder(403, "You are not authorized to access this resource"));
    }
    next();
};
