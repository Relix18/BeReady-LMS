import ErrorHanlder from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";
import { redis } from "../data/redis.js";
import { TryCatch } from "../middlewares/error.js";
export const isAuthenticated = TryCatch(async (req, res, next) => {
    const access_token = req.cookies.access_token;
    if (!access_token) {
        return next(new ErrorHanlder(400, "Please login to access this resource"));
    }
    const decoded = jwt.verify(access_token, process.env.JWT_SECRET);
    if (!decoded) {
        return next(new ErrorHanlder(400, "Please login to access this resource"));
    }
    const user = await redis.get(decoded.id);
    if (!user) {
        return next(new ErrorHanlder(400, "Please login to access this resource"));
    }
    req.user = JSON.parse(user);
    next();
});
//Validate User Role
export const isAuthorized = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return next(new ErrorHanlder(403, "You are not authorized to access this resource"));
    }
    next();
};
