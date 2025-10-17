async function insertHeader() {
  const mount = document.getElementById("app-header");
  if (!mount || mount.firstElementChild) return;

  const res = await fetch("/semantics/header/header.html");
  if (!res.ok) return;

  const html = await res.text();
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  mount.appendChild(t.content.firstElementChild);
}

document.addEventListener("DOMContentLoaded", () => insertHeader());
