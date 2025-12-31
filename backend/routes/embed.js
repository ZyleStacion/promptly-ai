import express from 'express';
import { publicChat } from '../controllers/embedController.js';
import { getModels } from '../controllers/ollamaController.js';
import Chatbot from '../models/chatbot.js';
import mongoose from 'mongoose';

const router = express.Router();

// Public, unauthenticated chat endpoint for embeddable widget
router.post('/public', publicChat);

// Get available Ollama models
router.get('/models', getModels);

// Get chatbot config for embedding (public endpoint)
router.get('/config/:chatbotId', async (req, res) => {
  try {
    const { chatbotId } = req.params;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(chatbotId)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid chatbot ID format. Please use a valid MongoDB ObjectId from your dashboard.' 
      });
    }
    
    const chatbot = await Chatbot.findById(chatbotId).select('name description welcomeMessage primaryColor profilePicture status');
    
    if (!chatbot) {
      return res.status(404).json({ success: false, error: 'Chatbot not found' });
    }

    if (chatbot.status !== 'active') {
      return res.status(403).json({ success: false, error: 'Chatbot is not active' });
    }

    res.json({ 
      success: true, 
      chatbot: {
        name: chatbot.name,
        description: chatbot.description,
        welcomeMessage: chatbot.welcomeMessage,
        primaryColor: chatbot.primaryColor,
        profilePicture: chatbot.profilePicture
      }
    });
  } catch (err) {
    console.error('Error fetching chatbot config:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch chatbot config' });
  }
});

export default router;
