import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import { getUsersAnalytics, getCoursesAnalytics, getOrdersAnalytics, } from "../controllers/analytics.controller.js";
const router = express.Router();
router.get("/get-user-analytics", isAuthenticated, isAuthorized, getUsersAnalytics);
router.get("/get-course-analytics", isAuthenticated, isAuthorized, getCoursesAnalytics);
router.get("/get-order-analytics", isAuthenticated, isAuthorized, getOrdersAnalytics);
export default router;
