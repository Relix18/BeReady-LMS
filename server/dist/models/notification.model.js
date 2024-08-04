import mongoose, { Schema } from "mongoose";
const notificationSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "unread",
    },
    user: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
export const Notification = mongoose.model("Notification", notificationSchema);
