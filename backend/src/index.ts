import express from "express";
import complaintRoutes from "./interfaces/routes/complaint.routes";
import authRoutes from "./interfaces/routes/auth.routes";
import { errorHandler } from "./interfaces/middleware/error.middleware";

const app = express();

app.use(errorHandler);
app.use(express.json());
app.use("/complaints", complaintRoutes);
app.use("/auth", authRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});