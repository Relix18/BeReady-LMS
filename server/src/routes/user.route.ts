import express from "express";
import {
  activateUser,
  login,
  logout,
  register,
} from "../controllers/user.controller.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/activation", activateUser);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);

export default router;
