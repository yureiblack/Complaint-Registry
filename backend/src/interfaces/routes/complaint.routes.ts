import express from "express";
import {
  createComplaint,
  getComplaint,
  updateStatus,
  getPublic,
  getMy,
  search,
  updateVisibility,
} from "../controllers/complaint.controller";

import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// =====================================================
// 🌐 PUBLIC + FILTER ROUTES (MUST COME FIRST)
// =====================================================

router.get("/public/all", getPublic);

router.get("/me/all", authMiddleware, getMy);

router.get("/search", authMiddleware, search);

// =====================================================
// CORE ROUTES
// =====================================================

router.post("/", authMiddleware, createComplaint);

router.get("/:id", authMiddleware, getComplaint);

router.patch("/:id/status", authMiddleware, updateStatus);

router.patch("/:id/visibility", authMiddleware, updateVisibility);

export default router;