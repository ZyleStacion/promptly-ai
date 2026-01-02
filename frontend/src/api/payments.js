import { API_URL } from './api';

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
