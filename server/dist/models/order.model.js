import mongoose, { Schema } from "mongoose";
const orderSchema = new Schema({
    courseId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    payment_info: {
        type: Object,
        // required: true,
    },
}, { timestamps: true });
export const Order = mongoose.model("Order", orderSchema);
