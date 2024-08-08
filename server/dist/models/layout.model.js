import { Schema, model } from "mongoose";
const faqSchema = new Schema({
    question: String,
    answer: String,
});
const categorySchema = new Schema({
    title: String,
});
const bannerImageSchema = new Schema({
    public_id: String,
    url: String,
});
const layoutSchema = new Schema({
    type: String,
    faqs: [faqSchema],
    categories: [categorySchema],
    bannerImage: {
        image: bannerImageSchema,
        title: String,
        subtitle: String,
    },
});
export const Layout = model("Layout", layoutSchema);
