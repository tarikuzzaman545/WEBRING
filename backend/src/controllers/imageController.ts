import { Request, Response } from "express";
import { readData, writeData } from "../utils/dataManager";
import cloudinary from "../utils/cloudinary";

export const getImages = (req: Request, res: Response) => {
  res.json(readData("images"));
};

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const { category, key, subIndex } = req.body;
    if (!req.file) return res.status(400).json({ error: "No image provided" });

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    
    const result = await cloudinary.uploader.upload(dataURI, { folder: `webring/${category}` });
    const url = result.secure_url;

    // Save to images.json
    const images = readData("images");
    if (category === "hero" && key === "featured") {
      images.hero.featured[parseInt(subIndex)] = url;
    } else if (category === "og") {
      images.og = url;
    } else {
      if (!images[category]) images[category] = {};
      images[category][key] = url;
    }
    writeData("images", images);

    res.json({ url });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteImage = (req: Request, res: Response) => {
  res.json({ success: true });
};
