import { User } from "../models/user.model";
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from "../middlewares/error.js";
import { activationToken } from "../utils/jwtToken";
import sendEmail from "../utils/sendMail";
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
    try {
        await sendEmail({
            email: user.email,
            subject: "Activate your account",
            message: `click here to activate your account ${activationCode}`,
        });
        res.status(201).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
            token,
        });
    }
    catch (error) {
        return next(new ErrorHandler(400, error.message));
    }
});
