import { app } from "./app.js";
import { connectDB } from "./data/database.js";
import dotenv from "dotenv";
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
});
dotenv.config({ path: ".env" });
connectDB();
const server = app.listen(process.env.PORT, () => {
    console.log(`listning on port ${process.env.PORT}`);
});
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);
    server.close(() => {
        process.exit(1);
    });
});
