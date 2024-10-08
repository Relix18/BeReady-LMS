import { Redis } from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const redisClient = () => {
  if (process.env.REDIS_URI) {
    console.log("redis connected");
    return process.env.REDIS_URI;
  }
  throw new Error("redis not connected");
};

export const redis = new Redis(redisClient());
