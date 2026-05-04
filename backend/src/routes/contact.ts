import { Router } from "express"; import { addMessage } from "../controllers/contactController"; const router = Router(); router.post("/", addMessage); export default router;
