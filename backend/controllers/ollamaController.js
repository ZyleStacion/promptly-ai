import { sendMessage } from '../services/ollamaService.js';

async function chat(req, res) {
  try {
    const { model, prompt } = req.body;
    const reply = await sendMessage(model, prompt);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get response from Ollama' });
  }
}

export { chat };
