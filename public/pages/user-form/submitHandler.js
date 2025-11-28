import { signin } from "../../fetch/loginApi.js";

export async function submitSignup(dto) {
  const { email, nickname, password, image } = dto;
  const res = await signin({
    email: email.value.trim(),
    nickname: nickname.value.trim(),
    password: password.value,
    image: image,
  });
  if (res.status === 200) {
    alert("회원가입이 완료되었습니다.");
    window.location.href = "/login";
  } else {
    alert("회원가입에 실패했습니다.");
  }
}

export async function submitPasswordUpdate(dto) {}
export async function submitProfileUpdate(dto) {}
