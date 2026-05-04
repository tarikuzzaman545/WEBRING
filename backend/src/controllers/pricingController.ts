import { Request, Response } from "express";
import { readData, writeData } from "../utils/dataManager";

export const getPricing = (req: Request, res: Response) => {
  res.json(readData("pricing"));
};

export const updatePricing = (req: Request, res: Response) => {
  const data = readData("pricing");
  const idx = data.tiers.findIndex((t: any) => t.id === req.params.tierId);
  if (idx !== -1) {
    data.tiers[idx] = { ...data.tiers[idx], ...req.body };
    writeData("pricing", data);
  }
  res.json({ success: true });
};
