import express from "express";
import connectDB from "./config/database.js";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import chatbotRoutes from "./routes/chatbot.js";
import ollamaRoutes from "./routes/chat.js";;
import userRoutes from "./routes/user.js";
import embedRoutes from "./routes/embed.js";
import cors from 'cors';
import googleAuthRoutes from "./routes/googleAuth.js";
import path from "path";
import { fileURLToPath } from "url";
import adminRoutes from "./routes/admin.js";
import paymentRoutes from "./routes/payment.js";
import { handleWebhook } from "./controllers/paymentController.js";
import feedbackRoutes from "./routes/feedback.js";
import adminFeedbackRoutes from "./routes/adminFeedback.js";
import usageRoutes from "./routes/usage.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure CORS - Allow multiple origins
const allowedOrigins = [
  'http://52.21.46.81.nip.io',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL,
  'http://13.216.200.51:5000',
  'http://13.216.200.51.nip.io:5000'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Allow anyway for now during debugging
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Request-Id'],
  maxAge: 86400, // 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Additional CORS headers middleware to ensure they're always present
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.indexOf(origin) !== -1) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  next();
});

// Mount webhook route with raw body parser BEFORE the global json parser
app.post('/payment/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRoutes);
app.use("/chatbot", chatbotRoutes);
app.use('/ollama', ollamaRoutes);
app.use('/chat', embedRoutes);
app.use("/auth", googleAuthRoutes);
app.use("/user", userRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/admin", adminRoutes);
app.use("/payment", paymentRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/admin/feedback", adminFeedbackRoutes);
app.use("/usage", usageRoutes);


// Connect to MongoDB
connectDB();

// route
app.get("/", (req, res) => {
  res.send("Promptly AI Server Running...");
});

// Server Listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("=======================================");
  console.log("🚀 Promptly AI Backend Server Started!");
  console.log(`🌐 Backend URL: http://13.216.200.51.nip.io:${PORT}`);
  console.log(`🎨 Frontend URL: ${process.env.FRONTEND_URL || 'http://52.21.46.81.nip.io'}`);
  console.log(`🤖 Ollama Server: ${process.env.OLLAMA_API_URL || 'http://52.54.14.252:11434'}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("=======================================");
});
