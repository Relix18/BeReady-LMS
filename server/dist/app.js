import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import user from "./routes/user.route.js";
import course from "./routes/course.route.js";
import order from "./routes/order.route.js";
import notification from "./routes/notification.route.js";
import analytics from "./routes/analytics.route.js";
import layout from "./routes/layout.route.js";
export const app = express();
dotenv.config({ path: ".env" });
export const envMode = process.env.NODE_ENV?.trim() || "DEVELOPMENT";
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));
//cookie parser
app.use(cookieParser());
//cors
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true,
}));
//routes
app.use("/api/v1", user);
app.use("/api/v1", course);
app.use("/api/v1", order);
app.use("/api/v1", notification);
app.use("/api/v1", analytics);
app.use("/api/v1", layout);
app.get("/", (req, res) => {
    res.send("Hello");
});
app.get("*", (req, res) => {
    res.send("404 Not Found");
});
app.use(errorMiddleware);
