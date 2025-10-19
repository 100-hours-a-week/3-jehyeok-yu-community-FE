import { publicClient } from "./apiClient.js";
import { saveToken } from "./sessionStorage.js";

export const login = (body) =>
  publicClient.post("/auth", body, { credentials: "include" }).then((res) => {
    const auth =
      res.headers.get("authorization") || res.headers.get("Authorization");
    if (auth !== undefined) saveToken(auth.split("Bearer ".length));
  });
