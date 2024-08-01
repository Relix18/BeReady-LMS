import { TryCatch } from "../middlewares/error.js";
import { Course } from "../models/course.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import { v2 as cloudinary } from "cloudinary";
import { redis } from "../data/redis.js";
//upload course
export const uploadCourse = TryCatch(async (req, res, next) => {
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
});
//Edit course
export const editCourse = TryCatch(async (req, res, next) => {
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
    const course = await Course.findByIdAndUpdate(req.params.id, { $set: data }, {
        new: true,
    });
    res.status(201).json({
        success: true,
        course,
    });
});
//get single course -- for all users
export const getSingleCourse = TryCatch(async (req, res, next) => {
    const courseId = req.params.id;
    const isCourseExist = await redis.get(courseId);
    if (isCourseExist) {
        const course = JSON.parse(isCourseExist);
        return res.status(200).json({
            success: true,
            course,
        });
    }
    const course = await Course.findById(req.params.id).select("-courseData.videoUrl -courseData.suggestions -courseData.questions -courseData.links");
    if (!course) {
        return next(new ErrorHandler(404, "Course not found"));
    }
    await redis.set(courseId, JSON.stringify(course));
    res.status(200).json({
        success: true,
        course,
    });
});
//get all courses -- for all users
export const getAllCourses = TryCatch(async (req, res, next) => {
    const isCourseExist = await redis.get("allCourses");
    if (isCourseExist) {
        const courses = JSON.parse(isCourseExist);
        return res.status(200).json({
            success: true,
            courses,
        });
    }
    const courses = await Course.find().select("-courseData.videoUrl -courseData.suggestions -courseData.questions -courseData.links");
    await redis.set("allCourses", JSON.stringify(courses));
    res.status(200).json({
        success: true,
        courses,
    });
});
