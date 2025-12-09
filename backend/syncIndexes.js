import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to DB");
    await User.syncIndexes();
    console.log("User indexes synced successfully");
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
