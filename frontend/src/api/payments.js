import { USE_MOCK_API, mockApi } from "./mockApi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function getInvoices() {

  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/payment/invoices`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to fetch invoices");
  }

  return res.json();
}

export default { getInvoices };
