import express from "express";
import {
  activateUser,
  deleteUser,
  getAllUser,
  getUserById,
  login,
  logout,
  register,
  socialAuth,
  updateAccessToken,
  updateAvatar,
  updatePassword,
  updateProfile,
  updateUserRole,
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
router.put("/update-profile", isAuthenticated, updateProfile);
router.put("/update-password", isAuthenticated, updatePassword);
router.put("/update-avatar", isAuthenticated, updateAvatar);
router.get("/all-users", isAuthenticated, isAuthorized, getAllUser);
router.put("/update-user", isAuthenticated, isAuthorized, updateUserRole);
router.delete("/delete-user/:id", isAuthenticated, isAuthorized, deleteUser);

export default router;
