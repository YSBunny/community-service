import { request } from "./http.js";

// 회원가입
export function signup({
    email,
    password,
    nickname,
    profileImage
}) {
    const formData = new FormData();

    formData.append("email", email);
    formData.append("password", password);
    formData.append("nickname", nickname);
    
    if (profileImage) {
        formData.append("profileImage", profileImage);
    }

    return request("/users", {
        method: "POST",
        body: formData,
        auth: false // 헤더를 넣지 않음
    });
}

// 회원정보 조회
export function getUser(userId, options = {}) {
  return request(`/users/${userId}`, {
    method: "GET",
    signal: options.signal
  });
}

// 회원정보 수정
export function updateUser(userId, userData) {
  return request(`/users/${userId}`, {
    method: "PATCH",
    body: userData
  });
}

// 회원 탈퇴
export function deleteUser(userId) {
  return request(`/users/${userId}`, {
    method: "DELETE"
  });
}
