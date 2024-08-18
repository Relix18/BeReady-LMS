import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import {
  addAnswer,
  addQuestion,
  addReply,
  addReview,
  deleteCourse,
  editCourse,
  generateVideoUrl,
  getAllCourse,
  getAllCourses,
  getCourseByUser,
  getSingleCourse,
  uploadCourse,
} from "../controllers/course.controller.js";
import { updateAccessToken } from "../controllers/user.controller.js";

const router = express.Router();

router.post(
  "/create-course",
  updateAccessToken,
  isAuthenticated,
  isAuthorized,
  uploadCourse
);
router.put(
  "/edit-course/:id",
  updateAccessToken,
  isAuthenticated,
  isAuthorized,
  editCourse
);
router.get("/get-course/:id", getSingleCourse);
router.get("/get-courses", getAllCourse);
router.get(
  "/get-course-content/:id",
  updateAccessToken,
  isAuthenticated,
  getCourseByUser
);
router.put("/add-question", updateAccessToken, isAuthenticated, addQuestion);
router.put("/add-answer", updateAccessToken, isAuthenticated, addAnswer);
router.put("/add-review/:id", updateAccessToken, isAuthenticated, addReview);
router.put(
  "/add-reply",
  updateAccessToken,
  isAuthenticated,
  isAuthorized,
  addReply
);
router.get(
  "/get-all-courses",
  updateAccessToken,
  isAuthenticated,
  isAuthorized,
  getAllCourses
);
router.delete(
  "/delete-course/:id",
  updateAccessToken,
  isAuthenticated,
  isAuthorized,
  deleteCourse
);
router.post("/getVdoCipherOTP", generateVideoUrl);

export default router;
