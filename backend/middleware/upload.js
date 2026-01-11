// middleware/upload.js
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Needed to fix dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use memory storage for MongoDB uploads (no disk writes)
const storage = multer.memoryStorage();

// Only accept images
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only JPG/PNG images allowed"), false);
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// Helper to convert file to base64 for MongoDB storage
export function fileToBase64(file) {
  if (!file) return null;
  const buffer = file.buffer;
  const base64 = buffer.toString('base64');
  return {
    data: base64,
    mimeType: file.mimetype
  };
}

export default upload;
