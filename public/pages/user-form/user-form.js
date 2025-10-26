import { BASE_URL } from "../../api/config.js";
import {
  submitPasswordUpdate,
  submitProfileUpdate,
  submitSignup,
} from "./submitHandler.js";
import {
  updateSubmitDisabled,
  validatePassword,
  validatePasswordAll,
  validatePasswordConfirm,
  validateProfileAll,
  validateSignupAll,
} from "./validation.js";
import { VIEW_MODE } from "./viewMode.js";

// // 텍스트
// const nickname = document.getElementById("nickname");
// const email = document.getElementById("email");
// const password = document.getElementById("password");
// const passwordConfirm = document.getElementById("passwordConfirm");

// // 제출버튼
// const signinButton = document.getElementById("signinButton");

// // 이미지
// const inputImage = document.getElementById("profile");
// const preview = document.getElementById("preview");
// const plus = document.getElementById("plus");

// 이미지 렌더 관련

// let blobUrl;
// let imageId;

// function renderEmpty(e) {
//   const helper = e.target.parentNode.parentNode.querySelector(".helper");

//   if (blobUrl) {
//     URL.revokeObjectURL(blobUrl);
//     blobUrl = null;
//   }
//   preview.style.backgroundImage = "";
//   plus.style.display = "block";
//   helper.style.display = "block";
//   e.target.style.display = "none";
// }

// async function renderImage(e) {
//   const file = e.target.files?.[0];
//   const helper = e.target.parentNode.querySelector(".helper");
//   if (!file || !file.type.startsWith("image/")) {
//     alert("이미지만 업로드 해주세요.");
//     renderEmpty();
//     return;
//   }
//   const formData = new FormData();
//   formData.append("image", file);

//   imageId = await fetch(BASE_URL + "/images", {
//     method: "POST",
//     body: formData, // Body에 직접 FormData 객체를 넣습니다.
//   });
//   if (blobUrl) URL.revokeObjectURL(blobUrl);
//   blobUrl = URL.createObjectURL(file);

//   preview.style.backgroundImage = `url('${blobUrl}')`;
//   helper.style.display = "none";
//   plus.style.display = "none";
//   removeBtn.style.display = "block";
// }

document.addEventListener("DOMContentLoaded", async () => {
  // 모드 결정
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode") ?? "signup";

  const spec = VIEW_MODE[mode];
  const elements = {
    nickname: document.getElementById("nickname"),
    email: document.getElementById("email"),
    password: document.getElementById("password"),
    passwordConfirm: document.getElementById("passwordConfirm"),

    profileInput: document.getElementById("profile"),
    previewEl: document.getElementById("preview"),
    plusEl: document.getElementById("plus"),
    removeBtnEl: document.getElementById("removeBtn"),
    helperProfileEl: document.querySelector("#sectionProfileImage .helper"),

    //이메일 내부
    emailSection: document.getElementById("sectionEmail"),
    emailDupButton: document.getElementById("emailDupButton"),
    emailHelper: document.getElementById("emailHelper"),
  };

  // 검증/제출 핸들러 설정
  const validateHandler =
    mode === "signup"
      ? validateSignupAll
      : mode === "profile"
      ? validateProfileAll
      : validatePasswordAll;

  const submitHandler =
    mode === "signup"
      ? submitSignup
      : mode === "profile"
      ? submitProfileUpdate
      : submitPasswordUpdate;

  // 고정 요소 설정
  const pageTitle = document.getElementById("page-title");
  const submitBtn = document.getElementById("submit-button");
  const backLink = document.getElementById("back-link");
  pageTitle.textContent = spec.title;
  submitBtn.textContent = spec.submitText;
  backLink.textContent = spec.backLinkText;
  backLink.href = spec.backLinkHref;

  const sectionIds = [
    "sectionProfileImage",
    "sectionEmail",
    "sectionNickname",
    "sectionPassword",
    "sectionPasswordConfirm",
  ];

  sectionIds.forEach((id) => {
    const sec = document.getElementById(id);
    if (!sec) return;
    const active = spec.show.includes(id);

    if (active) {
      sec.style.display = "";
      sec.querySelectorAll("input, button, select, textarea").forEach((n) => {
        n.disabled = false;
      });
    } else {
      sec.style.display = "none";
      sec.querySelectorAll("input, button, select, textarea").forEach((n) => {
        n.disabled = true;
      });
    }
  });
  if (mode !== "signup" && elements.emailSection) {
    if (elements.emailDupButton) {
      // 버튼 자체를 완전히 없애고 싶으면:
      elements.emailDupButton.style.display = "none";
      // 버튼 공간도 유지하고 싶으면:
      // elements.emailDupButton.style.visibility = "hidden";
      // elements.emailDupButton.disabled = true;
    }

    if (elements.emailHelper) {
      elements.emailHelper.classList.add("is-hidden");
    }

    if (elements.email) {
      const email = elements.email;
      email.value = "1@1.1";
      email.classList.add("readonly");
      email.setAttribute("readonly", "readonly");
      email.placeholder = "";
      // disabled로 하면 폼 제출 시 값이 안 나가니까 readonly가 적절함
    }
  }
  function refreshButton() {
    const ok = validateHandler(elements);
    updateSubmitDisabled(submitBtn, ok);
  }

  if (elements.email) {
    elements.email.addEventListener("input", () => {
      validateEmail(elements.email);
      refreshButton();
    });
    elements.email.addEventListener("blur", () => {
      validateEmail(elements.email);
      refreshButton();
    });
  }

  if (elements.nickname) {
    elements.nickname.addEventListener("input", () => {
      validateNickname(elements.nickname);
      refreshButton();
    });
  }

  if (elements.password) {
    elements.password.addEventListener("input", () => {
      validatePassword(elements.password, elements.passwordConfirm);
      refreshButton();
    });
  }

  if (elements.passwordConfirm) {
    elements.passwordConfirm.addEventListener("input", () => {
      validatePasswordConfirm(elements.password, elements.passwordConfirm);
      refreshButton();
    });
  }

  refreshButton();
  submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    refreshButton();
    if (submitBtn.disabled) return;
    await submitHandler(elements);
  });
});
