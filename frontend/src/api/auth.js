import { API_URL } from "./api";

export async function registerUser(data) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function loginUser(data) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const text = await res.text();
  let payload = {};
  try { payload = JSON.parse(text || "{}"); } catch (e) { payload = { message: text } }

  if (!res.ok) {
    const msg = payload.error || payload.message || 'Login failed';
    throw new Error(msg);
  }

  return payload;
}
