import mongoose, { Schema } from "mongoose";
const replySchema = new Schema({
    user: Object,
    reply: String,
}, {
    timestamps: true,
});
const reviewSchema = new Schema({
    user: Object,
    rating: {
        type: Number,
        default: 0,
    },
    comment: String,
    commentReplies: [replySchema],
}, {
    timestamps: true,
});
const linkSchema = new Schema({
    title: String,
    url: String,
});
const answerSchema = new Schema({
    user: Object,
    answer: String,
}, {
    timestamps: true,
});
const commentSchema = new Schema({
    user: Object,
    question: String,
    questionReplies: [answerSchema],
}, {
    timestamps: true,
});
const courseDataSchema = new Schema({
    title: String,
    description: String,
    videoUrl: String,
    videoSection: String,
    videoLength: Number,
    links: [linkSchema],
    suggestions: String,
    questions: [commentSchema],
});
const courseSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    category: {
        type: String,
        required: [true, "Category is required"],
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
    },
    estimatedPrice: {
        type: Number,
    },
    thumbnail: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        },
    },
    tags: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true,
    },
    demoUrl: {
        type: String,
        required: true,
    },
    benefits: [
        {
            title: String,
        },
    ],
    prerequisites: [
        {
            title: String,
        },
    ],
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    ratings: {
        type: Number,
        default: 0,
    },
    purchased: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
export const Course = mongoose.model("Course", courseSchema);
