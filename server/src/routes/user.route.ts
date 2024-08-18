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
router.get("/me", updateAccessToken, isAuthenticated, getUserById);
router.post("/social-auth", socialAuth);
router.put(
  "/update-profile",
  updateAccessToken,
  isAuthenticated,
  updateProfile
);
router.put(
  "/update-password",
  updateAccessToken,
  isAuthenticated,
  updatePassword
);
router.put("/update-avatar", updateAccessToken, isAuthenticated, updateAvatar);
router.get(
  "/all-users",
  updateAccessToken,
  isAuthenticated,
  isAuthorized,
  getAllUser
);
router.put(
  "/update-user",
  updateAccessToken,
  isAuthenticated,
  isAuthorized,
  updateUserRole
);
router.delete(
  "/delete-user/:id",
  updateAccessToken,
  isAuthenticated,
  isAuthorized,
  deleteUser
);

export default router;
