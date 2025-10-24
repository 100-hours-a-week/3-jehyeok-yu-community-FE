import { publicClient } from "../../api/apiClient.js";
import { signin } from "../../api/loginApi.js";

const nickname = document.getElementById("nickname");
const email = document.getElementById("email");
const password = document.getElementById("password");
const passwordConfirm = document.getElementById("passwordConfirm");
const signinButton = document.getElementById("signinButton");

function updateSubmit() {
  signinButton.disabled = ![nickname, email, password, passwordConfirm].every(
    (e) => helperOf(e)?.classList.contains("ok")
  );
}

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

// 검증 규칙
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 간단 이메일 포맷
const pwLenMin = 8;
const pwReHasLetter = /[A-Za-z]/;
const pwReHasDigit = /[0-9]/;
const pwReHasSpecial = /[^A-Za-z0-9]/;
const nickRe = /^[A-Za-z0-9가-힣]{2,10}$/; // 2~10자, 한/영/숫자

function validateEmail() {
  const v = email.value.trim();
  if (!v) return setFail(email, "이메일을 입력하세요.");
  if (!emailRe.test(v)) return setFail(email, "올바른 이메일 형식이 아닙니다.");
  return setOk(email, "좋아요.");
}

function validatePassword() {
  const v = password.value;
  if (!v) return setFail(password, "비밀번호를 입력하세요.");
  if (v.length < pwLenMin)
    return setFail(password, `비밀번호는 ${pwLenMin}자 이상이어야 합니다.`);
  if (
    !pwReHasLetter.test(v) ||
    !pwReHasDigit.test(v) ||
    !pwReHasSpecial.test(v)
  ) {
    return setFail(password, "영문/숫자/특수문자를 모두 포함하세요.");
  }
  validatePasswordConfirm();
  return setOk(password, "사용 가능한 비밀번호입니다.");
}

function validatePasswordConfirm() {
  const v = passwordConfirm.value;
  if (!v) return setFail(passwordConfirm, "비밀번호를 다시 입력하세요.");
  if (v !== password.value)
    return setFail(passwordConfirm, "비밀번호가 일치하지 않습니다.");
  return setOk(passwordConfirm, "일치합니다.");
}

function validateNickname() {
  const v = nickname.value.trim();
  if (!v) return setFail(nickname, "닉네임을 입력하세요.");
  if (!nickRe.test(v))
    return setFail(nickname, "닉네임은 2~10자, 한글/영문/숫자만 가능합니다.");
  return setOk(nickname, "좋아요.");
}

function validateAll() {
  const r1 = validateEmail();
  const r2 = validatePassword();
  const r3 = validatePasswordConfirm();
  const r4 = validateNickname();
  signinButton.disabled = !(r1 && r2 && r3 && r4);
  return signinButton.disabled ? false : true;
}

document.addEventListener("DOMContentLoaded", () => {
  email.addEventListener("blur", () => {
    validateEmail();
    updateSubmit();
  });
  email.addEventListener("input", () => {
    validateEmail();
    updateSubmit();
  });

  nickname.addEventListener("blur", () => {
    validateNickname();
    updateSubmit();
  });
  nickname.addEventListener("input", () => {
    validateNickname();
    updateSubmit();
  });

  password.addEventListener("input", () => {
    validatePassword();
    updateSubmit();
  });
  passwordConfirm.addEventListener("input", () => {
    validatePasswordConfirm();
    updateSubmit();
  });
  signinButton.addEventListener("click", async (e) => {
    e.preventDefault();
    validateAll();
    if (signinButton.disabled) return;

    const res = await signin({
      email: email.value.trim(),
      nickname: nickname.value.trim(),
      password: password.value,
    });
    if (res.status === 200) {
      alert("회원가입이 완료되었습니다.");
      window.location.href = "/login";
    } else {
      alert("회원가입에 실패했습니다.");
    }

    updateSubmit();
  });
});
