const API_URL = import.meta.env.VITE_API_URL || "";

export async function api(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options
  });
  const body = await response.text();
  let data = {};
  try {
    data = body ? JSON.parse(body) : {};
  } catch {
    data = { message: body };
  }
  if (!response.ok) {
    const error = new Error(Array.isArray(data.message) ? data.message.join(" ") : data.message || "Request failed");
    error.retryAfter = response.status === 429 ? Number(response.headers.get("retry-after")) || 0 : 0;
    throw error;
  }
  return data;
}
