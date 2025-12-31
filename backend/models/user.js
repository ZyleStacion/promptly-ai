import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetToken: { type: String },
  resetTokenExpire: { type: Date },

  profileImage: {
    type: String,
    default: "/uploads/default-avatar.png"
},
  
  isAdmin: { type: Boolean, default: false },   
  createdAt: { type: Date, default: Date.now },

  // Subscription data
  stripeCustomerId: { type: String},
  subscriptionStatus: { type: String, default: "none" }, // Active, cancelled
  subscriptionId: { type: String },
  subscriptionPlan: { type: String, default: "Basic" }, // Basic, Pro, Enterprise
  subscriptionStartDate: { type: Date },
  subscriptionEndDate: { type: Date},
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
