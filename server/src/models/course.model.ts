import mongoose, { Document, Schema, Model } from "mongoose";
import { IUser } from "./user.model";

interface IComment extends Document {
  user: IUser;
  question: string;
  questionReplies: IAnswer[];
}

interface IAnswer extends Document {
  user: IUser;
  answer: string;
}

interface IReply extends Document {
  user: IUser;
  reply: string;
}

interface IReview extends Document {
  user: IUser;
  rating: number;
  comment: string;
  commentReplies: IComment[];
}

interface ILink extends Document {
  title: string;
  url: string;
}

interface ICourseData extends Document {
  title: string;
  description: string;
  videoUrl: string;
  videoSection: string;
  videoLength: number;
  links: ILink[];
  suggestions: string;
  questions: IComment[];
}

interface IThumbnail extends Document {
  public_id: string;
  url: string;
}

interface ICourse extends Document {
  name: string;
  description?: string;
  category: string;
  price: number;
  estimatedPrice: number;
  thumbnail: IThumbnail;
  tags: string;
  level: string;
  demoUrl: string;
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  reviews: IReview[];
  courseData: ICourseData[];
  ratings?: number;
  purchased: number;
}

const replySchema = new Schema<IReply>(
  {
    user: Object,
    reply: String,
  },
  {
    timestamps: true,
  }
);

const reviewSchema = new Schema<IReview>(
  {
    user: Object,
    rating: {
      type: Number,
      default: 0,
    },
    comment: String,
    commentReplies: [replySchema],
  },
  {
    timestamps: true,
  }
);

const linkSchema = new Schema<ILink>({
  title: String,
  url: String,
});

const answerSchema = new Schema<IAnswer>(
  {
    user: Object,
    answer: String,
  },
  {
    timestamps: true,
  }
);

const commentSchema = new Schema<IComment>(
  {
    user: Object,
    question: String,
    questionReplies: [answerSchema],
  },
  {
    timestamps: true,
  }
);

const courseDataSchema = new Schema<ICourseData>({
  title: String,
  description: String,
  videoUrl: String,
  videoSection: String,
  videoLength: Number,
  links: [linkSchema],
  suggestions: String,
  questions: [commentSchema],
});

const courseSchema = new Schema<ICourse>(
  {
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
  },
  {
    timestamps: true,
  }
);

export const Course: Model<ICourse> = mongoose.model("Course", courseSchema);
