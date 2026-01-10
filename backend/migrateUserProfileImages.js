import mongoose from 'mongoose';
import User from './models/user.js';
import { config } from 'dotenv';

config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ollama_test";

async function migrateUserProfileImages() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Find all users
    const users = await User.find({});
    
    let migratedCount = 0;
    let skippedCount = 0;

    for (const user of users) {
      // Check if profileImage is a string (old format)
      if (typeof user.profileImage === 'string') {
        console.log(`Migrating user: ${user.username} (${user._id})`);
        
        // Set to null (new object format with null data)
        user.profileImage = {
          data: null,
          mimeType: null
        };
        
        await user.save();
        migratedCount++;
      } else if (user.profileImage && typeof user.profileImage === 'object') {
        // Already in new format
        skippedCount++;
      } else if (!user.profileImage) {
        // Ensure it has the correct structure
        user.profileImage = {
          data: null,
          mimeType: null
        };
        await user.save();
        migratedCount++;
      }
    }

    console.log(`\nMigration complete!`);
    console.log(`Total users: ${users.length}`);
    console.log(`Migrated: ${migratedCount}`);
    console.log(`Already in new format: ${skippedCount}`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

// Run the migration
migrateUserProfileImages();
