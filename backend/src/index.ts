import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth";
import contentRoutes from "./routes/content";
import imagesRoutes from "./routes/images";
import portfolioRoutes from "./routes/portfolio";
import teamRoutes from "./routes/team";
import pricingRoutes from "./routes/pricing";
import bookingRoutes from "./routes/booking";
import contactRoutes from "./routes/contact";
import messagesRoutes from "./routes/messages";

dotenv.config();
const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(helmet());
app.use(express.json());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use("/api/", limiter);

app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/images", imagesRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/messages", messagesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
