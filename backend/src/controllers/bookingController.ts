import { Request, Response } from "express";
import { readData, writeData } from "../utils/dataManager";
import { sendEmail } from "../utils/email";
import { v4 as uuidv4 } from "uuid";

export const addBooking = async (req: Request, res: Response) => {
  const data = readData("bookings");
  const booking = { id: uuidv4(), createdAt: new Date().toISOString(), status: "Pending", ...req.body };
  data.bookings.unshift(booking);
  writeData("bookings", data);

  await sendEmail(
    process.env.CONTACT_EMAIL || "hello@webring.studio",
    `New Booking: ${booking.name}`,
    `<p>Date: ${booking.date} at ${booking.timeSlot}</p><p>Services: ${booking.services}</p>`
  );
  res.json({ success: true });
};

export const getBookings = (req: Request, res: Response) => {
  res.json(readData("bookings"));
};

export const updateBookingStatus = (req: Request, res: Response) => {
  const data = readData("bookings");
  const booking = data.bookings.find((b: any) => b.id === req.params.id);
  if (booking) booking.status = req.body.status;
  writeData("bookings", data);
  res.json({ success: true });
};

export const getDates = (req: Request, res: Response) => {
  res.json(readData("availableDates"));
};

export const updateDates = (req: Request, res: Response) => {
  writeData("availableDates", req.body);
  res.json({ success: true });
};
