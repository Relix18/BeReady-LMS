import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import { User } from "../models/user.model.js";
import { generateAnalytics } from "../utils/analytics.js";
import { Course } from "../models/course.model.js";
import { Order } from "../models/order.model.js";

//get user analytics --only for admin
export const getUsersAnalytics = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await generateAnalytics(User);

    res.send({
      success: true,
      users,
    });
  }
);

//get course analytics --only for admin
export const getCoursesAnalytics = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const courses = await generateAnalytics(Course);

    res.send({
      success: true,
      courses,
    });
  }
);

//get order analytics --only for admin
export const getOrdersAnalytics = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const orders = await generateAnalytics(Order);

    res.send({
      success: true,
      orders,
    });
  }
);
