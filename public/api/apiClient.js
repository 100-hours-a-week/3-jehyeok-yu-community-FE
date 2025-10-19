import { BASE_URL } from "./config.js";
import { getAccessToken } from "./sessionStorage.js";

const make =
  (client, method) =>
  (path, opt = {}) =>
    client(path, { ...opt, method });

const makeWithBody =
  (client, method) =>
  (path, body, opt = {}) =>
    client(path, {
      ...opt,
      method,
      body: typeof body === "string" ? body : JSON.stringify(body),
    });

async function baseFetch(path, opt = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(opt.headers || {}),
  };
  return fetch(BASE_URL + path, { ...opt, headers });
}

export const publicClient = {
  fetch: (path, opt = {}) => baseFetch(path, opt),
  get: make(baseFetch, "GET"),
  post: makeWithBody(baseFetch, "POST"),
  put: makeWithBody(baseFetch, "PUT"),
  del: make(baseFetch, "DELETE"),
};

function authFetch(path, opt = {}) {
  const token = getAccessToken();
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(opt.headers || {}),
  };
  return baseFetch(path, { ...opt, credentials: "include", headers });
}

export const authClient = {
  fetch: authFetch,
  get: make(authFetch, "GET"),
  post: makeWithBody(authFetch, "POST"),
  put: makeWithBody(authFetch, "PUT"),
  del: make(authFetch, "DELETE"),
};
