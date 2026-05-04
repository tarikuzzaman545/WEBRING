import { Request, Response } from "express";
import { readData, writeData } from "../utils/dataManager";

export const getMessages = (req: Request, res: Response) => {
  res.json(readData("messages"));
};

export const markRead = (req: Request, res: Response) => {
  const data = readData("messages");
  const msg = data.messages.find((m: any) => m.id === req.params.id);
  if (msg) msg.read = true;
  writeData("messages", data);
  res.json({ success: true });
};

export const deleteMessage = (req: Request, res: Response) => {
  const data = readData("messages");
  data.messages = data.messages.filter((m: any) => m.id !== req.params.id);
  writeData("messages", data);
  res.json({ success: true });
};
