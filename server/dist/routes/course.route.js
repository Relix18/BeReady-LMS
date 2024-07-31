import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import { editCourse, uploadCourse } from "../controllers/course.controller.js";
const router = express.Router();
router.post("/create-course", isAuthenticated, isAuthorized, uploadCourse);
router.put("/edit-course/:id", isAuthenticated, isAuthorized, editCourse);
export default router;
