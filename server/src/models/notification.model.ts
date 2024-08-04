import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotification extends Document {
  title: string;
  message: string;
  status: string;
  user: string;
}

const notificationSchema = new Schema<INotification>(
  {
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
  },
  {
    timestamps: true,
  }
);

export const Notification: Model<INotification> = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);
