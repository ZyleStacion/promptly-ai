// controllers/userController.js
import User from "../models/user.js";
import bcrypt from "bcryptjs";

// GET CURRENT USER
export const getUser = async (req, res) => {
  return res.json({ user: req.user });
};

// UPDATE USER INFO + PROFILE IMAGE
export const updateUserInfo = async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({ message: "Username and email are required" });
    }

    let profileImage = req.user.profileImage;

    if (req.file) {
      profileImage = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { username, email, profileImage },
      { new: true }
    ).select("-password");

    return res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// CHANGE PASSWORD
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Current password incorrect" });
  }

  user.password = newPassword;
  await user.save();

  return res.json({ message: "Password updated successfully" });
};

// DELETE ACCOUNT
export const deleteAccount = async (req, res) => {
  await User.findByIdAndDelete(req.user._id);
  return res.json({ message: "Account deleted successfully" });
};

// UPLOAD PROFILE IMAGE ONLY
export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No file uploaded" });

    const imageUrl = `/uploads/${req.file.filename}`;

    await User.findByIdAndUpdate(req.user._id, { profileImage: imageUrl });

    return res.json({
      message: "Profile image uploaded",
      profileImage: imageUrl,
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
