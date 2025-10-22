import { authClient } from "./apiClient.js";
export const getPost = async (path) => {
  const res = await authClient.get(`/posts/${path}`);
  if (res.status === 200) return await res.json();

  if (res.status === 404) window.location.href = "/post-list";
};
