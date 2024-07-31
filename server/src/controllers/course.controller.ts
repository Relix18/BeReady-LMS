import { Request, Response, NextFunction } from "express";
import { TryCatch } from "../middlewares/error.js";
import { Course } from "../models/course.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import { v2 as cloudinary } from "cloudinary";

//upload course
export const uploadCourse = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const thumbnail = data.thumbnail;
    if (thumbnail) {
      const myCloud = await cloudinary.uploader.upload(thumbnail, {
        folder: "courses",
        width: 150,
        crop: "scale",
      });
      data.thumbnail = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }
    const course = await Course.create(data);
    res.status(201).json({
      success: true,
      course,
    });
  }
);

//Edit course
export const editCourse = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    if (!data) {
      return next(new ErrorHandler(400, "Please provide data"));
    }
    const thumbnail = data.thumbnail;
    if (thumbnail) {
      const myCloud = await cloudinary.uploader.upload(thumbnail, {
        folder: "courses",
        width: 150,
        crop: "scale",
      });
      data.thumbnail = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: data },
      {
        new: true,
      }
    );
    res.status(201).json({
      success: true,
      course,
    });
  }
);
