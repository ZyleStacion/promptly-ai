// middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export default async function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "secret123");
    // optional: fetch user if needed
    const user = await User.findById(payload.id).select("-password");
    if (!user) return res.status(401).json({ message: "Invalid token" });
    req.user = user; // attach to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid", error: err.message });
  }
}