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
  
  // Check if payload contains a File object (profilePicture)
  const hasFile = payload.profilePicture instanceof File;
  
  let body, headers;
  if (hasFile) {
    // Use FormData for file upload
    const formData = new FormData();
    Object.keys(payload).forEach(key => {
      if (key === 'trainingData') {
        formData.append(key, JSON.stringify(payload[key]));
      } else if (payload[key] !== null && payload[key] !== undefined) {
        formData.append(key, payload[key]);
      }
    });
    body = formData;
    headers = { Authorization: `Bearer ${token}` };
  } else {
    // Use JSON for non-file uploads
    body = JSON.stringify(payload);
    headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
  }
  
  const res = await fetch(`${API_URL}/chatbot/`, {
    method: 'POST',
    headers,
    body,
  });
  return handleResponse(res);
}

export async function updateChatbot(id, payload) {
  const token = localStorage.getItem('token');
  
  // Check if payload contains a File object (profilePicture)
  const hasFile = payload.profilePicture instanceof File;
  
  let body, headers;
  if (hasFile) {
    // Use FormData for file upload
    const formData = new FormData();
    Object.keys(payload).forEach(key => {
      if (key === 'trainingData') {
        formData.append(key, JSON.stringify(payload[key]));
      } else if (payload[key] !== null && payload[key] !== undefined) {
        formData.append(key, payload[key]);
      }
    });
    body = formData;
    headers = { Authorization: `Bearer ${token}` };
  } else {
    // Use JSON for non-file uploads
    body = JSON.stringify(payload);
    headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
  }
  
  const res = await fetch(`${API_URL}/chatbot/${id}`, {
    method: 'PUT',
    headers,
    body,
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
