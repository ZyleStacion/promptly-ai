import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  profileImage: {
    type: String,
    default: "/uploads/default-avatar.png"
},
  
  isAdmin: { type: Boolean, default: false },   

  createdAt: { type: Date, default: Date.now },
});

// Hash password before save
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare passwords
UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", UserSchema);
