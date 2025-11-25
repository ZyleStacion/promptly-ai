import express from "express";
import connectDB from "./config/database.js";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import chatbotRoutes from "./routes/chatbot.js";
import ollamaRoutes from "./routes/chat.js";;
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRoutes);
app.use("/chatbot", chatbotRoutes);
app.use('/ollama', ollamaRoutes);


// Connect to MongoDB
connectDB();

// Example route
app.get("/", (req, res) => {
  res.send("Promptly AI Server Running...");
});




// Listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
