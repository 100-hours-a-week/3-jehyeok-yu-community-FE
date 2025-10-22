import { authClient } from "./apiClient.js";

export const createPost = async (body) => {
  try {
    const res = await authClient.post("/posts", body);
    if (res.status === 204) {
      alert("게시물이 등록되었습니다.");
      window.location.href = `/post/${src}`;
    }
  } catch (err) {
    if (err.status === 401) {
      alert("로그인이 필요합니다.");
      window.location.href = "/login";
    } else {
      alert("등록 실패: " + err.message);
    }
  }
};

export const updatePost = async (src, body) => {
  try {
    const res = await authClient.put(`/posts/${src}`, body);
    if (res.status === 204) {
      alert("게시물이 수정되었습니다.");
      window.location.href = `/post/${src}`;
    }
  } catch (err) {
    if (err.status === 401) {
      alert("로그인이 필요합니다.");
      window.location.href = "/login";
    } else {
      alert("등록 실패: " + err.message);
    }
  }
};
