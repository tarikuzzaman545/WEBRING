import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("Email disabled (no credentials). Would send:", { to, subject });
      return true;
    }
    await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
    return true;
  } catch (error) {
    console.error("Email send failed:", error);
    return false;
  }
};
