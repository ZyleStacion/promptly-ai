import express from "express";
import connectDB from "./config/database.js";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import chatbotRoutes from "./routes/chatbot.js";
import ollamaRoutes from "./routes/chat.js";;
import userRoutes from "./routes/user.js";
import cors from 'cors';
import googleAuthRoutes from "./routes/googleAuth.js";
import path from "path";
import { fileURLToPath } from "url";
import adminRoutes from "./routes/admin.js";


dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cors());


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRoutes);
app.use("/chatbot", chatbotRoutes);
app.use('/ollama', ollamaRoutes);
app.use("/auth", googleAuthRoutes);
app.use("/user", userRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/admin", adminRoutes);


// Connect to MongoDB
connectDB();

// route
app.get("/", (req, res) => {
  res.send("Promptly AI Server Running...");
});


// Server Listener
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("=======================================");
  console.log("🚀 Promptly AI Backend Server Started!");
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📦 ENV: ${process.env.NODE_ENV || "development"}`);
  console.log("=======================================");
});
