import axios from 'axios';
import Chatbot from '../models/chatbot.js';
import mongoose from 'mongoose';

const OLLAMA_BASE = process.env.OLLAMA_API_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gemma3:1b-it-qat';

async function publicChat(req, res) {
  try {
    const { message, chatbotId } = req.body || {};
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Fetch chatbot configuration if chatbotId provided
    let chatbot = null;
    if (chatbotId) {
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(chatbotId)) {
        return res.status(400).json({ 
          error: 'Invalid chatbot ID format. Please use a valid MongoDB ObjectId from your dashboard.' 
        });
      }
      
      chatbot = await Chatbot.findById(chatbotId);
      if (!chatbot) {
        return res.status(404).json({ error: 'Chatbot not found' });
      }
    }

    // Build context from training data
    let trainingContext = '';
    if (chatbot && chatbot.trainingData && chatbot.trainingData.length > 0) {
      trainingContext = '\n\nBackground Information:\n';
      chatbot.trainingData.forEach((data) => {
        if (data.type === 'text') {
          trainingContext += `${data.content}\n`;
        } else if (data.type === 'file' && data.content) {
          trainingContext += `File ${data.filename}:\n${data.content}\n`;
        }
      });
    }

    // Build system prompt
    const systemPrompt = chatbot?.systemPrompt || 'You are a helpful assistant.';
    const personality = chatbot?.personality || 'friendly';
    const personalityPrompt = personality ? `\nYour personality is: ${personality}` : '';

    // Use chatbot's model or fallback to default
    const model = chatbot?.modelName || OLLAMA_MODEL;

    const prompt = `${systemPrompt}${personalityPrompt}${trainingContext}\n\nUser: ${message}\nAssistant:`;

    const payload = {
      model,
      stream: true,
      prompt,
    };

    const ollamaRes = await axios.post(`${OLLAMA_BASE}/api/generate`, payload, {
      responseType: 'stream',
      headers: { 'Content-Type': 'application/json' },
      timeout: 0,
    });

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');

    ollamaRes.data.on('data', (chunk) => {
      res.write(chunk);
    });

    ollamaRes.data.on('end', () => {
      res.end();
    });

    ollamaRes.data.on('error', (err) => {
      console.error('Ollama stream error:', err);
      if (!res.headersSent) {
        res.status(500).send('Stream error');
      } else {
        res.end();
      }
    });
  } catch (err) {
    console.error('Error in publicChat:', err?.message || err);
    return res.status(500).send('Something went wrong with Ollama');
  }
}

export { publicChat };
