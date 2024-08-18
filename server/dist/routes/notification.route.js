import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import { getNotifications, updateNotification, } from "../controllers/notification.controller.js";
import { updateAccessToken } from "../controllers/user.controller.js";
const router = express.Router();
router.get("/get-notifications", updateAccessToken, isAuthenticated, isAuthorized, getNotifications);
router.put("/update-notification/:id", updateAccessToken, isAuthenticated, isAuthorized, updateNotification);
export default router;
