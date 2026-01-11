import mongoose from 'mongoose';
import Chatbot from './models/chatbot.js';
import { config } from 'dotenv';

config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ollama_test";

async function migrateProfilePictures() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Find all chatbots with old string profilePicture format
    const chatbots = await Chatbot.find({});
    
    let migratedCount = 0;
    let skippedCount = 0;

    for (const chatbot of chatbots) {
      // Check if profilePicture is a string (old format)
      if (typeof chatbot.profilePicture === 'string') {
        console.log(`Migrating chatbot: ${chatbot.name} (${chatbot._id})`);
        
        // Set to null (new object format with null data)
        chatbot.profilePicture = {
          data: null,
          mimeType: null
        };
        
        await chatbot.save();
        migratedCount++;
      } else if (chatbot.profilePicture && typeof chatbot.profilePicture === 'object') {
        // Already in new format
        skippedCount++;
      } else if (!chatbot.profilePicture) {
        // Ensure it has the correct structure
        chatbot.profilePicture = {
          data: null,
          mimeType: null
        };
        await chatbot.save();
        migratedCount++;
      }
    }

    console.log(`\nMigration complete!`);
    console.log(`Total chatbots: ${chatbots.length}`);
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
migrateProfilePictures();
