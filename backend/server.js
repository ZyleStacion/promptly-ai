import express from "express";
import connectDB from "./config/database.js";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import chatbotRoutes from "./routes/chatbot.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRoutes);
app.use("/chatbot", chatbotRoutes);

// Connect to MongoDB
connectDB();

// Example route
app.get("/", (req, res) => {
  res.send("Promptly AI Server Running...");
});

// Listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
