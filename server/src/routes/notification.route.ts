import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import {
  getNotifications,
  updateNotification,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get(
  "/get-notifications",
  isAuthenticated,
  isAuthorized,
  getNotifications
);
router.put(
  "/update-notification/:id",
  isAuthenticated,
  isAuthorized,
  updateNotification
);

export default router;
