import os
import json

base_dir = "/Users/sabbir/Desktop/AI CLOUDE/backend"

# Ensure directories exist
dirs = [
    "src/routes", "src/middleware", "src/controllers", "src/data", "src/utils"
]
for d in dirs:
    os.makedirs(os.path.join(base_dir, d), exist_ok=True)

# Write Data Files
content_json = {
  "homepage": {
    "heroLine1": "We Engineer",
    "heroLine2": "Visual Reality.",
    "heroSubtitle": "From raw product shots to studio-perfect imagery.",
    "socialProof": "Trusted by 200+ e-commerce brands worldwide",
    "cta1": "See Our Work",
    "cta2": "Book a Free Call",
    "marqueeText": "AI PHOTOGRAPHY ✦ PRODUCT VISUALS ✦ LIFESTYLE IMAGERY ✦ E-COMMERCE CONTENT ✦ BRAND IDENTITY ✦",
    "ctaBannerHeading": "Ready to make your product irresistible?",
    "ctaBannerSub": "Book a free 30-minute strategy call."
  },
  "about": {
    "heading": "We Are WEBRING",
    "mission": "Premium AI-powered visual studio based in Bangladesh, serving e-commerce brands worldwide.",
    "teamHeading": "The Minds Behind WEBRING"
  },
  "contact": {
    "email": "hello@webring.studio",
    "whatsapp": "+880-XXXXXXXXXX",
    "responseTime": "Within 24 hours",
    "location": "Bangladesh — Available Worldwide"
  },
  "footer": {
    "tagline": "We Don't Just Edit. We Engineer Reality.",
    "copyright": "© 2024 WEBRING. All rights reserved."
  },
  "social": {
    "instagram": "#",
    "facebook": "#",
    "linkedin": "#",
    "behance": "#"
  }
}
with open(os.path.join(base_dir, "src/data/content.json"), "w") as f: json.dump(content_json, f, indent=2)

images_json = {
  "logo": { "main": "", "dark": "", "favicon": "" },
  "hero": { "featured": ["","","","","",""] },
  "team": { "mariful": "", "many": "", "sabbir": "" },
  "services": {
    "aiPhotography": "",
    "lifestyle": "",
    "ecommerce": "",
    "video": "",
    "branding": ""
  },
  "og": ""
}
with open(os.path.join(base_dir, "src/data/images.json"), "w") as f: json.dump(images_json, f, indent=2)

with open(os.path.join(base_dir, "src/data/portfolio.json"), "w") as f: json.dump({"items": [], "order": []}, f, indent=2)

team_json = {
  "members": [
    {
      "id": "mariful", "name": "Shiekh Mariful", "role": "CEO & Creative Director",
      "responsibilities": ["Creative Final Decision Maker", "Client Consultation"],
      "bio": "Leads the creative vision of WEBRING.", "photo": "", "social": { "instagram": "", "linkedin": "" }
    },
    {
      "id": "many", "name": "Many", "role": "Co-Founder & Growth Lead",
      "responsibilities": ["Lead Generation", "Business Development", "Consultation"],
      "bio": "Drives WEBRING growth strategy.", "photo": "", "social": { "instagram": "", "linkedin": "" }
    },
    {
      "id": "sabbir", "name": "Sabbir", "role": "HR Manager & Senior Editor",
      "responsibilities": ["Creative Initial Decision Maker", "AI Editing", "Team Operations"],
      "bio": "Bridges operations with creativity.", "photo": "", "social": { "instagram": "", "linkedin": "" }
    }
  ]
}
with open(os.path.join(base_dir, "src/data/team.json"), "w") as f: json.dump(team_json, f, indent=2)

pricing_json = {
  "tiers": [
    {
      "id": "starter", "name": "Starter", "price": 199, "period": "per project", "highlighted": False,
      "features": ["5 product images", "1 service type", "2 revisions", "3-day delivery"], "cta": "Get Started"
    },
    {
      "id": "growth", "name": "Growth", "price": 499, "period": "per project", "highlighted": True,
      "features": ["15 images", "3 service types", "Unlimited revisions", "5-day delivery", "Priority support"], "cta": "Book a Call"
    },
    {
      "id": "enterprise", "name": "Enterprise", "price": 0, "period": "custom", "highlighted": False,
      "features": ["Unlimited images", "All services", "Dedicated manager", "Custom timeline", "Monthly retainer"], "cta": "Contact Us"
    }
  ]
}
with open(os.path.join(base_dir, "src/data/pricing.json"), "w") as f: json.dump(pricing_json, f, indent=2)

with open(os.path.join(base_dir, "src/data/availableDates.json"), "w") as f: json.dump({"dates": [], "timeSlots": ["10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"]}, f, indent=2)
with open(os.path.join(base_dir, "src/data/bookings.json"), "w") as f: json.dump({"bookings": []}, f, indent=2)
with open(os.path.join(base_dir, "src/data/messages.json"), "w") as f: json.dump({"messages": []}, f, indent=2)

print("Data files written")

# Write Utils
with open(os.path.join(base_dir, "src/utils/dataManager.ts"), "w") as f:
    f.write('''import fs from "fs";
import path from "path";

export const readData = (filename: string) => {
  const filepath = path.join(__dirname, `../data/${filename}.json`);
  if (!fs.existsSync(filepath)) return null;
  return JSON.parse(fs.readFileSync(filepath, "utf8"));
};

export const writeData = (filename: string, data: any) => {
  const filepath = path.join(__dirname, `../data/${filename}.json`);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
};
''')

with open(os.path.join(base_dir, "src/utils/cloudinary.ts"), "w") as f:
    f.write('''import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
''')

with open(os.path.join(base_dir, "src/utils/email.ts"), "w") as f:
    f.write('''import nodemailer from "nodemailer";
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
''')

print("Utils written")

# Write Middleware
with open(os.path.join(base_dir, "src/middleware/auth.ts"), "w") as f:
    f.write('''import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "webring_super_secret_2024");
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
''')

with open(os.path.join(base_dir, "src/middleware/upload.ts"), "w") as f:
    f.write('''import multer from "multer";

const storage = multer.memoryStorage();
export const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
''')

print("Middleware written")

# Write Controllers
with open(os.path.join(base_dir, "src/controllers/authController.ts"), "w") as f:
    f.write('''import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const login = (req: Request, res: Response) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ admin: True }, process.env.JWT_SECRET || "webring_super_secret_2024", { expiresIn: "24h" });
    return res.json({ token });
  }
  return res.status(401).json({ error: "Invalid password" });
};

export const verify = (req: Request, res: Response) => {
  return res.json({ valid: true });
};
''')

with open(os.path.join(base_dir, "src/controllers/contentController.ts"), "w") as f:
    f.write('''import { Request, Response } from "express";
import { readData, writeData } from "../utils/dataManager";

export const getContent = (req: Request, res: Response) => {
  res.json(readData("content"));
};

export const updateContent = (req: Request, res: Response) => {
  writeData("content", req.body);
  res.json({ success: true });
};
''')

with open(os.path.join(base_dir, "src/controllers/imageController.ts"), "w") as f:
    f.write('''import { Request, Response } from "express";
import { readData, writeData } from "../utils/dataManager";
import cloudinary from "../utils/cloudinary";

export const getImages = (req: Request, res: Response) => {
  res.json(readData("images"));
};

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const { category, key, subIndex } = req.body;
    if (!req.file) return res.status(400).json({ error: "No image provided" });

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    
    const result = await cloudinary.uploader.upload(dataURI, { folder: `webring/${category}` });
    const url = result.secure_url;

    // Save to images.json
    const images = readData("images");
    if (category === "hero" && key === "featured") {
      images.hero.featured[parseInt(subIndex)] = url;
    } else if (category === "og") {
      images.og = url;
    } else {
      if (!images[category]) images[category] = {};
      images[category][key] = url;
    }
    writeData("images", images);

    res.json({ url });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteImage = (req: Request, res: Response) => {
  res.json({ success: true });
};
''')

with open(os.path.join(base_dir, "src/controllers/portfolioController.ts"), "w") as f:
    f.write('''import { Request, Response } from "express";
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
''')

with open(os.path.join(base_dir, "src/controllers/teamController.ts"), "w") as f:
    f.write('''import { Request, Response } from "express";
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
''')

with open(os.path.join(base_dir, "src/controllers/pricingController.ts"), "w") as f:
    f.write('''import { Request, Response } from "express";
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
''')

with open(os.path.join(base_dir, "src/controllers/contactController.ts"), "w") as f:
    f.write('''import { Request, Response } from "express";
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
''')

with open(os.path.join(base_dir, "src/controllers/messagesController.ts"), "w") as f:
    f.write('''import { Request, Response } from "express";
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
''')

with open(os.path.join(base_dir, "src/controllers/bookingController.ts"), "w") as f:
    f.write('''import { Request, Response } from "express";
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
''')

print("Controllers written")

# Write Routes
with open(os.path.join(base_dir, "src/routes/auth.ts"), "w") as f: f.write('import { Router } from "express"; import { login, verify } from "../controllers/authController"; import { requireAuth } from "../middleware/auth"; const router = Router(); router.post("/login", login); router.get("/verify", requireAuth, verify); export default router;\n')
with open(os.path.join(base_dir, "src/routes/content.ts"), "w") as f: f.write('import { Router } from "express"; import { getContent, updateContent } from "../controllers/contentController"; import { requireAuth } from "../middleware/auth"; const router = Router(); router.get("/", getContent); router.put("/", requireAuth, updateContent); export default router;\n')
with open(os.path.join(base_dir, "src/routes/images.ts"), "w") as f: f.write('import { Router } from "express"; import { getImages, uploadImage, deleteImage } from "../controllers/imageController"; import { requireAuth } from "../middleware/auth"; import { upload } from "../middleware/upload"; const router = Router(); router.get("/", getImages); router.post("/upload", requireAuth, upload.single("image"), uploadImage); router.delete("/:category/:key", requireAuth, deleteImage); export default router;\n')
with open(os.path.join(base_dir, "src/routes/portfolio.ts"), "w") as f: f.write('import { Router } from "express"; import { getPortfolio, addPortfolio, updatePortfolio, deletePortfolio, reorderPortfolio } from "../controllers/portfolioController"; import { requireAuth } from "../middleware/auth"; const router = Router(); router.get("/", getPortfolio); router.post("/", requireAuth, addPortfolio); router.put("/reorder", requireAuth, reorderPortfolio); router.put("/:id", requireAuth, updatePortfolio); router.delete("/:id", requireAuth, deletePortfolio); export default router;\n')
with open(os.path.join(base_dir, "src/routes/team.ts"), "w") as f: f.write('import { Router } from "express"; import { getTeam, updateTeam } from "../controllers/teamController"; import { requireAuth } from "../middleware/auth"; const router = Router(); router.get("/", getTeam); router.put("/:memberId", requireAuth, updateTeam); export default router;\n')
with open(os.path.join(base_dir, "src/routes/pricing.ts"), "w") as f: f.write('import { Router } from "express"; import { getPricing, updatePricing } from "../controllers/pricingController"; import { requireAuth } from "../middleware/auth"; const router = Router(); router.get("/", getPricing); router.put("/:tierId", requireAuth, updatePricing); export default router;\n')
with open(os.path.join(base_dir, "src/routes/contact.ts"), "w") as f: f.write('import { Router } from "express"; import { addMessage } from "../controllers/contactController"; const router = Router(); router.post("/", addMessage); export default router;\n')
with open(os.path.join(base_dir, "src/routes/messages.ts"), "w") as f: f.write('import { Router } from "express"; import { getMessages, markRead, deleteMessage } from "../controllers/messagesController"; import { requireAuth } from "../middleware/auth"; const router = Router(); router.get("/", requireAuth, getMessages); router.put("/:id/read", requireAuth, markRead); router.delete("/:id", requireAuth, deleteMessage); export default router;\n')
with open(os.path.join(base_dir, "src/routes/booking.ts"), "w") as f: f.write('import { Router } from "express"; import { addBooking, getBookings, updateBookingStatus, getDates, updateDates } from "../controllers/bookingController"; import { requireAuth } from "../middleware/auth"; const router = Router(); router.post("/", addBooking); router.get("/", requireAuth, getBookings); router.put("/:id/status", requireAuth, updateBookingStatus); router.get("/dates", getDates); router.put("/dates", requireAuth, updateDates); export default router;\n')

print("Routes written")

# Index.ts
with open(os.path.join(base_dir, "src/index.ts"), "w") as f:
    f.write('''import express from "express";
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
''')

# Env
with open(os.path.join(base_dir, ".env"), "w") as f:
    f.write('''PORT=5000
ADMIN_PASSWORD=webring2024
JWT_SECRET=webring_super_secret_2024
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_USER=
EMAIL_PASS=
CONTACT_EMAIL=hello@webring.studio
FRONTEND_URL=http://localhost:3000
''')

print("Backend fully setup via script.")
