import { Request, Response, NextFunction } from "express";
import { TryCatch } from "../middlewares/error.js";
import { Course } from "../models/course.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import { v2 as cloudinary } from "cloudinary";
import { redis } from "../data/redis.js";
import mongoose from "mongoose";
import sendEmail from "../utils/sendMail.js";
import { Notification } from "../models/notification.model.js";
import axios from "axios";

//upload course
export const uploadCourse = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const thumbnail = data.thumbnail;
    if (thumbnail) {
      const myCloud = await cloudinary.uploader.upload(thumbnail, {
        folder: "courses",
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
    const courseData = await Course.findById(req.params.id);

    const thumbnail = data.thumbnail;
    if (thumbnail) {
      if (courseData && !thumbnail.startsWith("https")) {
        await cloudinary.uploader.destroy(courseData.thumbnail.public_id);
      }
      const myCloud = await cloudinary.uploader.upload(thumbnail, {
        folder: "courses",
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

    await redis.del(req.params.id);

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

    await redis.set(courseId, JSON.stringify(course), "EX", 604800);
    res.status(200).json({
      success: true,
      course,
    });
  }
);

//get all courses -- for all users
export const getAllCourse = TryCatch(
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

    await Notification.create({
      user: req.user,
      title: `New Question`,
      message: `${req.user?.name} has added a new question in ${courseContent.title}`,
    });

    await course.save();

    res.status(200).json({
      success: true,
      course,
    });
  }
);

//add answer in question
interface IAddAnswer {
  questionId: string;
  courseId: string;
  contentId: string;
  answer: string;
}

export const addAnswer = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { questionId, courseId, contentId, answer } = req.body as IAddAnswer;
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
      await Notification.create({
        user: req.user._id,
        title: `New Question Reply`,
        message: `${req.user?.name} has replied on your question ${course?.name}`,
      });
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

//add review in course
interface IAddReview {
  review: string;
  courseId: string;
  rating: number;
  userId: string;
}

export const addReview = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const usreCourseLIst = req.user?.courses;
    const courseId = req.params.id;
    const isCourseExist = usreCourseLIst?.find(
      (course) => course.courseId.toString() === courseId
    );
    if (!isCourseExist) {
      return next(
        new ErrorHandler(404, "You don't have access to this course")
      );
    }
    const course = await Course.findById(courseId);

    const { review, rating } = req.body as IAddReview;

    const reviewData: any = {
      user: req.user,
      comment: review,
      rating,
    };

    course?.reviews.push(reviewData);

    let avg = 0;

    course?.reviews.forEach((item: any) => {
      avg += item.rating;
    });

    if (course) {
      course.ratings = avg / course?.reviews.length;
    }

    await course?.save();

    await Notification.create({
      user: req.user,
      title: `New Review`,
      message: `${req.user?.name} has reviewed ${course?.name}`,
    });

    res.status(200).json({
      success: true,
      course,
    });
  }
);

//add reply in review
interface IAddReply {
  reviewId: string;
  courseId: string;
  comment: string;
}
export const addReply = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { reviewId, courseId, comment } = req.body as IAddReply;
    const course = await Course.findById(courseId);
    if (!course) {
      return next(new ErrorHandler(404, "Course not found"));
    }

    const review = course?.reviews?.find(
      (item: any) => item._id.toString() === reviewId
    );

    if (!review) {
      return next(new ErrorHandler(404, "Review not found"));
    }
    const newReply: any = {
      user: req.user,
      comment,
    };

    if (!review.commentReplies) {
      review.commentReplies = [];
    }

    review.commentReplies.push(newReply);

    await course.save();

    res.status(200).json({
      success: true,
      course,
    });
  }
);

//get all course -- for admin
export const getAllCourses = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, courses });
  }
);

//delete course --admin

export const deleteCourse = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const course = await Course.findById(req.params.id);
    if (!course) {
      return next(new ErrorHandler(404, "Course not found"));
    }

    if (course.thumbnail?.public_id) {
      await cloudinary.uploader.destroy(course.thumbnail.public_id);
    }

    await course.deleteOne();
    await redis.del(id);
    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  }
);

//genrate video url
export const generateVideoUrl = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { videoId } = req.body;
    const response = await axios.post(
      `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
      {
        ttl: 300,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
        },
      }
    );
    res.json(response.data);
  }
);
