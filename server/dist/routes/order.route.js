import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import { createOrder, getAllOrder } from "../controllers/order.controller.js";
import { updateAccessToken } from "../controllers/user.controller.js";
const router = express.Router();
router.post("/create-order", updateAccessToken, isAuthenticated, createOrder);
router.get("/all-orders", updateAccessToken, isAuthenticated, isAuthorized, getAllOrder);
export default router;
