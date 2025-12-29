import { sendMessage, listModels } from '../services/ollamaService.js';

async function chat(req, res) {
  try {
    const { model, prompt } = req.body;
    const reply = await sendMessage(model, prompt);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get response from Ollama' });
  }
}

async function getModels(req, res) {
  try {
    const models = await listModels();
    res.json({ success: true, models });
  } catch (err) {
    console.error('Error fetching models:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch models from Ollama' });
  }
}

export { chat, getModels };
