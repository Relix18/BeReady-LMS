import { TryCatch } from "../middlewares/error.js";
import { Notification } from "../models/notification.model.js";
import ErrorHanlder from "../utils/errorHandler.js";
import cron from "node-cron";
//get notifications -- only admin
export const getNotifications = TryCatch(async (req, res, next) => {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, notifications });
});
//update nofication status -- only admin
export const updateNotification = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(id, { status: "read" }, { new: true });
    if (!notification) {
        return next(new ErrorHanlder(404, "Notification not found"));
    }
    await notification.save();
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, notifications });
});
//delete notification -- only admin
cron.schedule("0 0 0 * * *", async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await Notification.deleteMany({
        status: "read",
        createdAt: { $lt: thirtyDaysAgo },
    });
    console.log("notifications deleted");
});
