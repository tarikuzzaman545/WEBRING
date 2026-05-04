import { Request, Response } from "express";
import { readData, writeData } from "../utils/dataManager";
import { sendEmail } from "../utils/email";
import { v4 as uuidv4 } from "uuid";

export const addMessage = async (req: Request, res: Response) => {
  const data = readData("messages");
  const msg = { id: uuidv4(), date: new Date().toISOString(), read: false, ...req.body };
  data.messages.unshift(msg);
  writeData("messages", data);

  await sendEmail(
    process.env.CONTACT_EMAIL || "hello@webring.studio",
    `New Contact: ${msg.subject}`,
    `<p>From: ${msg.name} (${msg.email})</p><p>Service: ${msg.service}</p><p>${msg.message}</p>`
  );
  
  res.json({ success: true });
};
