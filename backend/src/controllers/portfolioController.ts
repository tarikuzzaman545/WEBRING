import { Request, Response } from "express";
import { readData, writeData } from "../utils/dataManager";
import { v4 as uuidv4 } from "uuid";

export const getPortfolio = (req: Request, res: Response) => {
  res.json(readData("portfolio"));
};

export const addPortfolio = (req: Request, res: Response) => {
  const data = readData("portfolio");
  const newItem = { id: uuidv4(), ...req.body };
  data.items.push(newItem);
  data.order.push(newItem.id);
  writeData("portfolio", data);
  res.json(newItem);
};

export const updatePortfolio = (req: Request, res: Response) => {
  const data = readData("portfolio");
  const idx = data.items.findIndex((i: any) => i.id === req.params.id);
  if (idx !== -1) {
    data.items[idx] = { ...data.items[idx], ...req.body };
    writeData("portfolio", data);
  }
  res.json({ success: true });
};

export const deletePortfolio = (req: Request, res: Response) => {
  const data = readData("portfolio");
  data.items = data.items.filter((i: any) => i.id !== req.params.id);
  data.order = data.order.filter((id: string) => id !== req.params.id);
  writeData("portfolio", data);
  res.json({ success: true });
};

export const reorderPortfolio = (req: Request, res: Response) => {
  const data = readData("portfolio");
  data.order = req.body.order;
  writeData("portfolio", data);
  res.json({ success: true });
};
