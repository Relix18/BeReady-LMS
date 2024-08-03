import { Request, Response, NextFunction } from "express";
import { TryCatch } from "../middlewares/error.js";
import { Course } from "../models/course.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import { v2 as cloudinary } from "cloudinary";
import { redis } from "../data/redis.js";
import mongoose from "mongoose";
import sendEmail from "../utils/sendMail.js";

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

//get single course -- for all users
export const getSingleCourse = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.id;
    const isCourseExist = await redis.get(courseId);
    if (isCourseExist) {
      const course = JSON.parse(isCourseExist);
      return res.status(200).json({
        success: true,
        course,
      });
    }

    const course = await Course.findById(req.params.id).select(
      "-courseData.videoUrl -courseData.suggestions -courseData.questions -courseData.links"
    );

    if (!course) {
      return next(new ErrorHandler(404, "Course not found"));
    }

    await redis.set(courseId, JSON.stringify(course));
    res.status(200).json({
      success: true,
      course,
    });
  }
);

//get all courses -- for all users
export const getAllCourses = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const isCourseExist = await redis.get("allCourses");
    if (isCourseExist) {
      const courses = JSON.parse(isCourseExist);
      return res.status(200).json({
        success: true,
        courses,
      });
    }
    const courses = await Course.find().select(
      "-courseData.videoUrl -courseData.suggestions -courseData.questions -courseData.links"
    );

    await redis.set("allCourses", JSON.stringify(courses));
    res.status(200).json({
      success: true,
      courses,
    });
  }
);

//get course content -- for valid user
export const getCourseByUser = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const userCourses = req.user?.courses;
    const courseId = req.params.id;

    const isCourseExist = userCourses?.find(
      (course) => course.courseId.toString() === courseId
    );

    if (!isCourseExist) {
      return next(
        new ErrorHandler(404, "You don't have access to this course")
      );
    }
    const courses = await Course.findById(courseId);

    res.status(200).json({
      success: true,
      courses,
    });
  }
);

// add question in course
interface IAddQuestion {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestion = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { question, courseId, contentId } = req.body as IAddQuestion;
    const course = await Course.findById(courseId);
    if (!course) {
      return next(new ErrorHandler(404, "Course not found"));
    }

    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return next(new ErrorHandler(404, "Invalid content id"));
    }

    const courseContent = course?.courseData?.find(
      (item: any) => item._id.toString() === contentId
    );

    if (!courseContent) {
      return next(new ErrorHandler(404, "Content not found"));
    }

    const newQuestion: any = {
      user: req.user,
      question,
      questionReplies: [],
    };

    courseContent.questions.push(newQuestion);
    await course.save();

    res.status(200).json({
      success: true,
      course,
    });
  }
);

//add answer in question
interface IAddReply {
  questionId: string;
  courseId: string;
  contentId: string;
  answer: string;
}

export const addAnswer = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { questionId, courseId, contentId, answer } = req.body as IAddReply;
    const course = await Course.findById(courseId);
    if (!course) {
      return next(new ErrorHandler(404, "Course not found"));
    }

    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return next(new ErrorHandler(404, "Invalid content id"));
    }

    const courseContent = course?.courseData?.find(
      (item: any) => item._id.toString() === contentId
    );

    if (!courseContent) {
      return next(new ErrorHandler(404, "Content not found"));
    }

    const question = courseContent?.questions?.find(
      (item: any) => item._id.toString() === questionId
    );
    if (!question) {
      return next(new ErrorHandler(404, "Question not found"));
    }

    const newAnswer: any = {
      user: req.user,
      answer,
    };

    question.questionReplies.push(newAnswer);

    await course.save();

    if (req.user?._id === question.user._id) {
      // add notification
      console.log("same user");
    } else {
      await sendEmail({
        email: question.user.email,
        subject: "Question Reply",
        message: `Your question has been replied to.`,
      });
    }

    res.status(200).json({
      success: true,
      course,
    });
  }
);
