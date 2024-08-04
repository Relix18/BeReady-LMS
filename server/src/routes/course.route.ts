import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import {
  addAnswer,
  addQuestion,
  addReply,
  addReview,
  editCourse,
  getAllCourses,
  getCourseByUser,
  getSingleCourse,
  uploadCourse,
} from "../controllers/course.controller.js";
import { addAbortListener } from "stream";

const router = express.Router();

router.post("/create-course", isAuthenticated, isAuthorized, uploadCourse);
router.put("/edit-course/:id", isAuthenticated, isAuthorized, editCourse);
router.get("/get-course/:id", getSingleCourse);
router.get("/get-courses", getAllCourses);
router.get("/get-course-content/:id", isAuthenticated, getCourseByUser);
router.put("/add-question", isAuthenticated, addQuestion);
router.put("/add-answer", isAuthenticated, addAnswer);
router.put("/add-review/:id", isAuthenticated, addReview);
router.put("/add-reply", isAuthenticated, isAuthorized, addReply);

export default router;
