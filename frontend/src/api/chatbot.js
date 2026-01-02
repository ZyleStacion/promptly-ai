import { API_URL } from './api';

async function handleResponse(res) {
  const text = await res.text().catch(() => '');
  let payload = {};
  try { payload = JSON.parse(text || '{}'); } catch (e) { payload = { message: text } }
  if (!res.ok) throw new Error(payload.error || payload.message || 'Request failed');
  return payload;
}

export async function getChatbots() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/chatbot/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}

export async function createChatbot(payload) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/chatbot/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updateChatbot(id, payload) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/chatbot/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deleteChatbot(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/chatbot/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}

export default { getChatbots, createChatbot, updateChatbot, deleteChatbot };
