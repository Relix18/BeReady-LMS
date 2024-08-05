import { TryCatch } from "../middlewares/error.js";
import { Notification } from "../models/notification.model.js";
import ErrorHanlder from "../utils/errorHandler.js";

//get notifications -- only admin
export const getNotifications = TryCatch(async (req, res, next) => {
  const notifications = await Notification.find().sort({ createdAt: -1 });

  res.status(200).json({ success: true, notifications });
});

//update nofication status -- only admin
export const updateNotification = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const notification = await Notification.findByIdAndUpdate(
    id,
    { status: "read" },
    { new: true }
  );

  if (!notification) {
    return next(new ErrorHanlder(404, "Notification not found"));
  }

  await notification.save();

  const notifications = await Notification.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, notifications });
});
