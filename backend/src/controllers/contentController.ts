import { Request, Response } from "express";
import { readData, writeData } from "../utils/dataManager";

export const getContent = (req: Request, res: Response) => {
  res.json(readData("content"));
};

export const updateContent = (req: Request, res: Response) => {
  writeData("content", req.body);
  res.json({ success: true });
};
