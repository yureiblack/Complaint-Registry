import express from "express";
import {
  createComplaint,
  getComplaint,
  updateStatus,
} from "../controllers/complaint.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", authMiddleware, createComplaint);
router.get("/:id", authMiddleware, getComplaint);
router.patch("/:id/status", authMiddleware, updateStatus);

export default router;