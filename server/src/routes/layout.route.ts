import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import {
  createLayout,
  editLayout,
  getLayout,
} from "../controllers/layout.controller.js";
import { updateAccessToken } from "../controllers/user.controller.js";

const router = express.Router();

router.post(
  "/create-layout",
  updateAccessToken,
  isAuthenticated,
  isAuthorized,
  createLayout
);
router.put(
  "/edit-layout",
  updateAccessToken,
  isAuthenticated,
  isAuthorized,
  editLayout
);
router.get("/get-layout", getLayout);

export default router;
