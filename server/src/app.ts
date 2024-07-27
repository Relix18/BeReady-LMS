import express, { Request, Response, Router } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import user from "./routes/user.route.js";

export const app = express();
dotenv.config({ path: ".env" });
export const envMode = process.env.NODE_ENV?.trim() || "DEVELOPMENT";

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));

//cookie parser
app.use(cookieParser());

//cors
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

//routes
app.use("/api/v1", user);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello");
});

app.get("*", (req, res) => {
  res.send("404 Not Found");
});

app.use(errorMiddleware);
