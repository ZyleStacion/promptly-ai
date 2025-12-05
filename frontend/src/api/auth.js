import { USE_MOCK_API, mockApi } from "./mockApi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function registerUser(data) {
  // Use mock API if enabled
  if (USE_MOCK_API) {
    return mockApi.registerUser(data);
  }

  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function loginUser(data) {
  // Use mock API if enabled
  if (USE_MOCK_API) {
    return mockApi.loginUser(data);
  }

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}
