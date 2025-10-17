import { BASE_URL } from "./config.js";

export function createClientApi() {
  const BASE = BASE_URL;
  const headers = { "Content-Type": "application/json" };

  async function req(path, opts = {}) {
    const res = await fetch(BASE + path, {
      credentials: "include",
      headers,
      ...opts,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    try {
      return text ? JSON.parse(text) : null;
    } catch {
      return text;
    }
  }

  return {
    get: (p) => req(p),
    post: (p, b) => req(p, { method: "POST", body: JSON.stringify(b) }),
    patch: (p, b) => req(p, { method: "PATCH", body: JSON.stringify(b) }),
    del: (p) => req(p, { method: "DELETE" }),
  };
}
