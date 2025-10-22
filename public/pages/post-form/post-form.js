import { authClient } from "../../api/apiClient.js";
import { createPost, updatePost } from "../../api/postFormApi.js";
const pNode = document.querySelector(".compose");
const target = new URLSearchParams(window.location.search).get("postId");

// 다른 텍스트나 이벤트 구성 필요
// 분기 필요 template 배치 끝나면 구성

const createPostTemplate = async (target) => {
  let dto;
  if (target) {
    const res = await authClient.get(`/posts/${target}`);
    const data = await res.json();
    dto = data.data;
  }
  return `       
    <h2 class="compose-title">게시글 ${dto ? "수정" : "작성"}</h2>
        <form id="postCreateForm" class="compose-form" novalidate>
          <div class="field">
            <label for="title" class="label"></label>
            <input
              id="title"
              name="title"
              type="text"
              maxlength="26"
              class="input"
              placeholder="제목을 입력해주세요. (최대 26글자)"
              value = "${dto ? dto.title : ""}"
              required
            />
            <p class="helper">제목은 26자 이내로 작성해주세요.</p>
          </div>

          <!-- 내용 -->
          <div class="field">
            <label for="content" class="label">내용 *</label>
            <textarea
              id="content"
              name="content"
              class="textarea"
              placeholder="내용을 입력해주세요."
              required
            >${dto ? dto.content : ""}</textarea>
            <p class="helper">게시글 본문은 LONGTEXT로 저장됩니다.</p>
          </div>

          <!-- 이미지 업로드 -->
          <div class="field">
            <span class="label">이미지</span>
            <label class="file">
              <input id="image" name="image" type="file" accept="image/*" />
              <span class="file-btn">파일 선택</span>
              <span class="file-name" id="fileName">파일을 선택해주세요.</span>
            </label>
          </div>

          <!-- 제출 -->
          <div class="actions">
            <button type="button" id="submitButton" class="btn primary full">
              ${dto ? "수정" : "생성"}
            </button>
          </div>
        </form>`;
};

document.addEventListener("DOMContentLoaded", async () => {
  const postTemplate = await createPostTemplate(target);
  pNode.innerHTML = postTemplate;

  // 이벤트 다는 과정
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

  validateContent();
  validateTitle();
  updateSubmit();
  // addEventListner
  title.addEventListener("input", (e) => {
    validateTitle();
    updateSubmit();
  });
  content.addEventListener("input", (e) => {
    validateContent();
    updateSubmit();
  });
  submitButton.addEventListener("click", (e) => {
    const body = {
      title: title.value.trim(),
      content: content.value.trim(),
    };
    target ? updatePost(target, body) : createPost(body);
  });
});
