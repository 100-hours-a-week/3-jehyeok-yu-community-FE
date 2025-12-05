import { AvatarComponent } from "./header/avatar.js";

const HOME = "post-list";

async function insertHeader() {
  const mount = document.getElementById("app-header");
  if (!mount || mount.firstElementChild) return;

  const res = await fetch("/semantics/header/header.html");
  if (!res.ok) return;

  const html = await res.text();
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  mount.appendChild(t.content.firstElementChild);

  const titleText = document.querySelector(".h-title");
  titleText.addEventListener("click", (e) => {
    window.location.href = `${window.location.origin}/${HOME}`;
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await insertHeader();
  await (async function () {
    const mount = document.querySelector("#app-footer .f-wrap");
    if (!mount || mount.firstElementChild) return;
    const res = await fetch("/semantics/footer/footer.html");
    const html = await res.text();
    const t = document.createElement("template");
    console.log(t);
    t.innerHTML = html.trim();
    mount.appendChild(t.content.firstElementChild);
  })();

  const avatar = new AvatarComponent(".h-actions");
  avatar.init();
});
