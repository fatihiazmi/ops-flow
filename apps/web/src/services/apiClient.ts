const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export async function checkHealth() {
  const res = await fetch(`${API_BASE_URL}/health`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function checkReady() {
  const res = await fetch(`${API_BASE_URL}/ready`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
