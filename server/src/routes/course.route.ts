import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import {
  addAnswer,
  addQuestion,
  editCourse,
  getAllCourses,
  getCourseByUser,
  getSingleCourse,
  uploadCourse,
} from "../controllers/course.controller.js";

const router = express.Router();

router.post("/create-course", isAuthenticated, isAuthorized, uploadCourse);
router.put("/edit-course/:id", isAuthenticated, isAuthorized, editCourse);
router.get("/get-course/:id", getSingleCourse);
router.get("/get-courses", getAllCourses);
router.get("/get-course-content/:id", isAuthenticated, getCourseByUser);
router.put("/add-question", isAuthenticated, addQuestion);
router.put("/add-answer", isAuthenticated, addAnswer);

export default router;
