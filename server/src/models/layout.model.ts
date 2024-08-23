import { Schema, Model, Document, model } from "mongoose";

interface FaqItem extends Document {
  question: string;
  answer: string;
}

interface Category extends Document {
  title: string;
}

interface BannerImage extends Document {
  public_id: string;
  url: string;
}

interface Layout extends Document {
  type: string;
  faqs: FaqItem[];
  categories: Category[];
  banner: {
    image: BannerImage;
    title: string;
    subtitle: string;
  };
}

const faqSchema = new Schema<FaqItem>({
  question: String,
  answer: String,
});

const categorySchema = new Schema<Category>({
  title: String,
});

const bannerImageSchema = new Schema<BannerImage>({
  public_id: String,
  url: String,
});

const layoutSchema = new Schema<Layout>({
  type: String,
  faqs: [faqSchema],
  categories: [categorySchema],
  banner: {
    image: bannerImageSchema,
    title: String,
    subtitle: String,
  },
});

export const Layout: Model<Layout> = model<Layout>("Layout", layoutSchema);
