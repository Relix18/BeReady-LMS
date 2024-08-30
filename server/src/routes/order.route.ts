import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import {
  createOrder,
  getAllOrder,
  processPayment,
  sendStripeKey,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/create-order", isAuthenticated, createOrder);
router.get("/all-orders", isAuthenticated, isAuthorized, getAllOrder);
router.get("/payment/stripepublishkey", sendStripeKey);
router.post("/payment", isAuthenticated, processPayment);

export default router;
