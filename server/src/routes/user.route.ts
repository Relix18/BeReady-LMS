import express from "express";
import {
  activateUser,
  getUserById,
  login,
  logout,
  register,
  socialAuth,
  updateAccessToken,
} from "../controllers/user.controller.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/activation", activateUser);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/refresh-token", updateAccessToken);
router.get("/me", isAuthenticated, getUserById);
router.post("/social-auth", socialAuth);

export default router;
