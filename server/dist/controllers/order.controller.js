import { TryCatch } from "../middlewares/error.js";
import ErrorHanlder from "../utils/errorHandler.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";
import { Course } from "../models/course.model.js";
//create order
export const createOrder = TryCatch(async (req, res, next) => {
    const { courseId, payment_info } = req.body;
    const user = await User.findById(req.user?._id);
    const courseExistInUser = user?.courses?.find((course) => course.courseId.toString() === courseId);
    if (courseExistInUser) {
        return next(new ErrorHanlder(404, "You already purchased this course"));
    }
    const course = await Course.findById(courseId);
    if (!course) {
        return next(new ErrorHanlder(404, "Course not found"));
    }
    const data = {
        userId: req.user?._id,
        courseId: course._id,
        payment_info,
    };
    const order = await Order.create(data);
    course.purchased += 1;
    await course.save();
    user?.courses.push({
        courseId: course._id,
    });
    await user?.save();
    //send mail
    await Notification.create({
        title: "New Order",
        message: `${user?.name} has purchased ${course?.name}`,
        user: user?._id,
    });
    res.status(201).json({
        success: true,
        order,
    });
});
//get all order -- for admin
export const getAllOrder = TryCatch(async (req, res, next) => {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
});
