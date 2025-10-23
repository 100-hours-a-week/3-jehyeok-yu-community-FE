import { logout } from "../api/loginApi.js";
import { getAccessToken } from "../api/sessionStorage.js";

// 혹시 몰라 남겨둠, 지금은 중복 체크하게 되어 지움.
// const pages = {
//   NON_AUTH: ["signin", "login"],
//   AUTH: ["post-list", "post-create", "post"],
// };

// const HOME = "post-list";
// const LOGIN = "login";

// (function () {
//   const at = getAccessToken(); // 콜백 함수로 이후 기능 구현 필요
//   const goto = (url, msg) => {
//     if (msg) alert(msg);
//     if (url === currentPath) return;
//     alert("세션이 만료되어 홈으로 이동합니다.");
//     window.location.href = `/${url}`;
//   };

//   const currentPath = window.location.pathname.split("/")[1];
//   const isAuth = pages.AUTH.includes(currentPath);
//   const isNon = pages.NON_AUTH.includes(currentPath);
//   if (isAuth && !at) goto(LOGIN);
//   else if (isNon && at) goto(HOME, "로그인 된 상태입니다. 홈으로 이동합니다.");
// })();

async function insertHeader() {
  const mount = document.getElementById("app-header");
  if (!mount || mount.firstElementChild) return;

  const res = await fetch("/semantics/header/header.html");
  if (!res.ok) return;

  const html = await res.text();
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  mount.appendChild(t.content.firstElementChild);

  const token = getAccessToken();
  if (token) {
    // 회원 정보 채우는 로직 추가.
    const logoutButton = document.getElementById("logout");
    const avatar = document.getElementById("h-avatar");

    logoutButton.disabled = false;
    avatar.disabled = false;
    logoutButton.addEventListener("click", (e) => {
      logout();
    });
  }
}

document.addEventListener("DOMContentLoaded", () => insertHeader());
