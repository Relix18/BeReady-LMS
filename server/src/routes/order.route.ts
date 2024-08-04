import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { createOrder } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/create-order", isAuthenticated, createOrder);

export default router;
