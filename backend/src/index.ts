import express from "express";
import complaintRoutes from "./interfaces/routes/complaint.routes";
import authRoutes from "./interfaces/routes/auth.routes";

const app = express();

app.use(express.json());
app.use("/complaints", complaintRoutes);
app.use("/auth", authRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});