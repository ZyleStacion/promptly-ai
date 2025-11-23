// Creates a new user and handles user login
import User from "../models/user.js";

export const register = async (req, res) => {
  try {
    const user = await User.create(req.body);

    // Convert mongoose document to plain object and remove the password field
    const userObj = user.toObject();
    delete userObj.password;
    
    // TODO: Add JWT token generation
    // TODO: Add error handling for duplicate emails

    res.status(201).json({ message: "User created", user: userObj });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(400).json({ error: "Invalid password" });

  res.status(200).json({ message: "Login successful", user });
};