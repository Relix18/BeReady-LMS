import ErrorHandler from "../utils/errorHandler.js";
export const errorMiddleware = (err, req, res, next) => {
    err.message ||= "Internal Server Error";
    err.status = err.status || 500;
    const response = {
        success: false,
        message: err.message,
    };
    //Wrong Mongodb id error
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(400, message);
    }
    //MOngoose duplicate key error
    if (err.status === 11000) {
        const message = `${Object.keys(err.keyValue)} already exists`;
        err = new ErrorHandler(400, message);
    }
    //Wrong JWT error
    if (err.name === "JsonWebTokenError") {
        const message = `Json Web Token is invalid, try again`;
        err = new ErrorHandler(400, message);
    }
    //JWT Expire error
    if (err.name === "TokenExpiredError") {
        const message = `Json Web Token is Expired, try again`;
        err = new ErrorHandler(400, message);
    }
    return res.status(err.status).json(response);
};
export const TryCatch = (passedFunc) => async (req, res, next) => {
    try {
        await passedFunc(req, res, next);
    }
    catch (error) {
        next(error);
    }
};
