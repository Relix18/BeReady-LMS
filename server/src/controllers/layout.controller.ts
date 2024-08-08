import { Request, Response, NextFunction } from "express";
import { TryCatch } from "../middlewares/error.js";
import { Layout } from "../models/layout.model.js";
import { v2 as cloudinary } from "cloudinary";
import ErrorHandler from "../utils/errorHandler.js";

//create layout
export const createLayout = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { type } = req.body;
    const isTypeExist = await Layout.findOne({ type });

    if (isTypeExist) {
      return next(new ErrorHandler(400, `${type} already exists`));
    }
    if (type === "Banner") {
      const { image, title, subtitle } = req.body;

      const myCloud = await cloudinary.uploader.upload(image, {
        folder: "layout",
      });
      const banner = {
        image: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
        title,
        subtitle,
      };
      const layout = await Layout.create(banner);
    }

    if (type === "FAQ") {
      const { faq } = req.body;

      const faqItems = await Promise.all(
        faq.map(async (item: any) => {
          return {
            question: item.question,
            answer: item.answer,
          };
        })
      );

      await Layout.create({ type, faqs: faqItems });
    }
    if (type === "Categories") {
      const { categories } = req.body;
      const categoryItems = await Promise.all(
        categories.map(async (item: any) => {
          return {
            title: item.title,
          };
        })
      );
      await Layout.create({ type, categories: categoryItems });
    }
    res.status(201).json({
      success: true,
      message: "Layout created successfully",
    });
  }
);

//edit layout
export const editLayout = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { type } = req.body;

    if (type === "Banner") {
      const { image, title, subtitle } = req.body;
      const bannerData: any = await Layout.find({ type: "Banner" });
      if (bannerData) {
        await cloudinary.uploader.destroy(bannerData.image.public_id);
      }
      const myCloud = await cloudinary.uploader.upload(image, {
        folder: "layout",
      });
      const banner = {
        image: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
        title,
        subtitle,
      };
      await Layout.findByIdAndUpdate(bannerData._id, banner, { new: true });
    }

    if (type === "FAQ") {
      const { faq } = req.body;
      const faqData: any = await Layout.findOne({ type: "FAQ" });
      const faqItems = await Promise.all(
        faq.map(async (item: any) => {
          return {
            question: item.question,
            answer: item.answer,
          };
        })
      );

      await Layout.findByIdAndUpdate(
        faqData._id,
        { faqs: faqItems },
        { new: true }
      );
    }
    if (type === "Categories") {
      const { categories } = req.body;
      const categoryData: any = await Layout.findOne({ type: "Categories" });
      const categoryItems = await Promise.all(
        categories.map(async (item: any) => {
          return {
            title: item.title,
          };
        })
      );
      await Layout.findByIdAndUpdate(
        categoryData._id,
        { categories: categoryItems },
        { new: true }
      );
    }
    res.status(201).json({
      success: true,
      message: "Layout updated successfully",
    });
  }
);

//get layout by type
export const getLayout = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { type } = req.body;
    const layout = await Layout.findOne({ type });
    res.status(200).json({
      success: true,
      layout,
    });
  }
);
