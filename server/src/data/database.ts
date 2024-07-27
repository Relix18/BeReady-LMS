import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const data = await mongoose.connect(process.env.MONGO_URL as string, {
      dbName: "BeReady_LMS",
    });
    console.log(`MongoDB connected: ${data.connection.name}`);
  } catch (err) {
    console.log(err);
  }
};
