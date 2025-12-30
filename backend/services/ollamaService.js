import axios from 'axios';

// Use your EC2 public IP and port 11434
const ollamaApi = axios.create({
  baseURL: process.env.OLLAMA_API_URL, // e.g., http://<EC2_PUBLIC_IP>:11434
  timeout: 30000, // 30 seconds
});

async function sendMessage(model, prompt) {
  try {
    const response = await ollamaApi.post('/run', {
      model: model,
      prompt: prompt,
    });
    return response.data.response; // Ollama returns JSON { response: "..." }
  } catch (err) {
    console.error('Ollama API error:', err.message);
    throw err;
  }
}

async function listModels() {
  try {
    const response = await ollamaApi.get('/api/tags');
    return response.data.models || [];
  } catch (err) {
    console.error('Failed to fetch Ollama models:', err.message);
    throw err;
  }
}

export { sendMessage, listModels };
