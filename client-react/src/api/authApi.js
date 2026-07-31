import { request } from "./http.js";

// 로그인
export function login(loginData) {
  return request("/auth/login", {
    method: "POST",
    auth: false,
    body: JSON.stringify(loginData)
  });
}

// 로그아웃
export function logout() {
  return request("/auth/logout", {
    method: "POST"
  });
}
