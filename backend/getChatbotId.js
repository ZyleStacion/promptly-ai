// Quick script to get your first chatbot ID
import mongoose from 'mongoose';
import Chatbot from './models/chatbot.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/promptly_ai';

async function getChatbotId() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const chatbots = await Chatbot.find().select('_id name description').limit(5);
    
    if (chatbots.length === 0) {
      console.log('❌ No chatbots found in database.');
      console.log('Please create a chatbot first through the dashboard at http://localhost:5173');
    } else {
      console.log('\n📋 Available Chatbots:\n');
      chatbots.forEach((bot, i) => {
        console.log(`${i + 1}. ${bot.name}`);
        console.log(`   ID: ${bot._id}`);
        console.log(`   Description: ${bot.description || 'No description'}`);
        console.log(`   Embed code:`);
        console.log(`   <div data-promptly-chatbot-id="${bot._id}"></div>\n`);
      });
      
      console.log('Copy the ID above and paste it into your widget-demo.html or widget-demo2.html');
      console.log('Replace the data-promptly-chatbot-id value with this ID.');
    }

    await mongoose.connection.close();
    console.log('\n✅ Disconnected from MongoDB');
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

getChatbotId();
