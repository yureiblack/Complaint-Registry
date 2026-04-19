import express from "express";
import {
  createComplaint,
  getComplaint,
  updateStatus
} from "../controllers/complaint.controller";

const router = express.Router();

router.post("/", createComplaint);
router.get("/:id", getComplaint);
router.patch("/:id/status", updateStatus);

export default router;