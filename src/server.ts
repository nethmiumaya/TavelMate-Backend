import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth-routes";
import destinationRoutes from "./routes/destination-routes";
import activityRoutes from "./routes/activity-routes";
import itineraryRoutes from "./routes/itinerary-routes";
import sharedRoutes from "./routes/shared-routs"; // Import the shared routes

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/itineraries", itineraryRoutes);
app.use("/api/itineraries", sharedRoutes); // Use the shared routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));