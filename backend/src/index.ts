import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import complaintRoutes from "./interfaces/routes/complaint.routes";
import authRoutes from "./interfaces/routes/auth.routes";
import notificationRoutes from "./interfaces/routes/notification.routes";
import { errorHandler } from "./interfaces/middleware/error.middleware";

// Load env FIRST (important)
dotenv.config();

const app = express();

// -------------------------
// CORE MIDDLEWARES
// -------------------------
app.use(cors());
app.use(express.json());

// -------------------------
// ROUTES
// -------------------------
app.use("/auth", authRoutes);
app.use("/complaints", complaintRoutes);
app.use("/notifications", notificationRoutes);

// -------------------------
// ERROR HANDLER (MUST BE LAST)
// -------------------------
app.use(errorHandler);

// -------------------------
// START SERVER
// -------------------------
app.listen(3000, () => {
  console.log("Server running on port 3000");
});