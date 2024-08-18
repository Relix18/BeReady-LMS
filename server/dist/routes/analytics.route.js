import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import { getUsersAnalytics, getCoursesAnalytics, getOrdersAnalytics, } from "../controllers/analytics.controller.js";
import { updateAccessToken } from "../controllers/user.controller.js";
const router = express.Router();
router.get("/get-user-analytics", updateAccessToken, isAuthenticated, isAuthorized, getUsersAnalytics);
router.get("/get-course-analytics", updateAccessToken, isAuthenticated, isAuthorized, getCoursesAnalytics);
router.get("/get-order-analytics", updateAccessToken, isAuthenticated, isAuthorized, getOrdersAnalytics);
export default router;
