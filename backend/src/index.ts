import express from "express";
import complaintRoutes from "./interfaces/routes/complaint.routes";

const app = express();

app.use(express.json());
app.use("/complaints", complaintRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});