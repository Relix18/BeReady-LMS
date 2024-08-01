import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import { editCourse, getAllCourses, getSingleCourse, uploadCourse, } from "../controllers/course.controller.js";
const router = express.Router();
router.post("/create-course", isAuthenticated, isAuthorized, uploadCourse);
router.put("/edit-course/:id", isAuthenticated, isAuthorized, editCourse);
router.get("/get-course/:id", getSingleCourse);
router.get("/get-courses", getAllCourses);
export default router;
