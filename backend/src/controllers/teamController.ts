import { Request, Response } from "express";
import { readData, writeData } from "../utils/dataManager";

export const getTeam = (req: Request, res: Response) => {
  res.json(readData("team"));
};

export const updateTeam = (req: Request, res: Response) => {
  const data = readData("team");
  const idx = data.members.findIndex((m: any) => m.id === req.params.memberId);
  if (idx !== -1) {
    data.members[idx] = { ...data.members[idx], ...req.body };
    writeData("team", data);
  }
  res.json({ success: true });
};
