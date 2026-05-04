import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const login = (req: Request, res: Response) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ admin: true }, process.env.JWT_SECRET || "webring_super_secret_2024", { expiresIn: "24h" });
    return res.json({ token });
  }
  return res.status(401).json({ error: "Invalid password" });
};

export const verify = (req: Request, res: Response) => {
  return res.json({ valid: true });
};
