import { authClient, publicClient } from "./apiClient.js";
import { deleteAccessToken, saveToken } from "./sessionStorage.js";

export const login = (body) =>
  publicClient.post("/auth", body, { credentials: "include" }).then((res) => {
    const auth =
      res.headers.get("authorization") || res.headers.get("Authorization");
    if (auth !== undefined) saveToken(auth.substring("Bearer ".length));
  });

export const logout = () =>
  authClient.del("/auth").then((res) => {
    deleteAccessToken();
    window.location.href = "/login";
  });

export const signin = (body) => publicClient.post("/users", body);
