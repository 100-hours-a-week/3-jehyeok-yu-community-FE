import { login } from "../../api/loginApi.js";
import { getAccessToken } from "../../api/sessionStorage.js";

document.addEventListener("DOMContentLoaded", () => {
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const loginButton = document.getElementById("loginButton");

  // email.addEventListener("change", (e) => {
  //   createClientApi().post("auth/check-email", e.target);
  // });
  if (getAccessToken() !== undefined) window.location = "/post-list";

  loginButton.addEventListener("click", (e) => {
    login({
      email: email.value,
      rawPassword: password.value,
    }).then(() => {
      window.location = "/post-list";
    });
  });
});
