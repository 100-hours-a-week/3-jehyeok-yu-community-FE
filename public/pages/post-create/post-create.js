import { authClient } from "../../api/apiClient.js";

const title = document.getElementById("title");
const content = document.getElementById("content");
const submitButton = document.getElementById("submitButton");

const helperOf = (input) => input.closest(".field")?.querySelector(".helper");

function setHelper(input, msg, state) {
  const h = helperOf(input);
  if (!h) return;
  h.textContent = msg ?? "";
  h.classList.remove("error", "ok");
  if (state) h.classList.add(state);
}

function setFail(input, msg) {
  setHelper(input, msg, "error");
  return false;
}

function setOk(input, msg) {
  setHelper(input, msg, "ok");
  return true;
}

function validateTitle() {
  const v = title.value.trim();
  if (!v) return setFail(title, "제목을 입력하세요.");
  if (v.length > 26) return setFail(title, "제목은 26자 이내로 작성하세요.");
  return setOk(title, "좋아요.");
}

function validateContent() {
  const v = content.value.trim();
  if (!v) return setFail(content, "내용을 입력하세요.");
  return setOk(content, "좋아요.");
}

function updateSubmit() {
  const valid =
    helperOf(title)?.classList.contains("ok") &&
    helperOf(content)?.classList.contains("ok");
  submitButton.disabled = !valid;
  submitButton.style.backgroundColor = valid ? "#7F6AEE" : "#ACAOEB"; // 색상 변경
}

document.addEventListener("DOMContentLoaded", () => {
  title.addEventListener("input", () => {
    validateTitle();
    updateSubmit();
  });
  content.addEventListener("input", () => {
    validateContent();
    updateSubmit();
  });
  submitButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const body = {
      title: title.value.trim(),
      content: content.value.trim(),
    };
    try {
      const res = await authClient.post("/posts", body);
      if (res.status === 200) {
        alert("게시물이 등록되었습니다.");
        location.replace("/post-list");
      }
    } catch (err) {
      if (err.status === 401) {
        alert("로그인이 필요합니다.");
        location.replace("/login");
      } else {
        alert("등록 실패: " + err.message);
      }
    }
  });
});
