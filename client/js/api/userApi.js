import { request } from "./http.js";

// 회원가입
export function signup(userData) {
    return request("/users", {
        method: "POST",
        body: JSON.stringify(userData)
    });
}

// 로그인
export function login(userData) {
    return request("/users/login", {
        method: "POST",
        body: JSON.stringify(userData)
    });
}

// 회원조회
export function getUser(userId) {
    return request(`/users/${userId}`, {
        method: "GET"
    });
}

// 회원정보 수정
export function updateUser(userId, userData) {
    return request(`/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify(userData)
    });
}

// 비밀번호 수정
export function updatePassword(userId, userData) {
    return request(`/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify(userData)
    });
}

// 로그아웃
export function logout(userData) {
    return request(`/users/logout`, {
        method: "POST",
        body: JSON.stringify(userData)
    });
}

// 회원탈퇴
export function deleteUser(userId, userData) {
    return request(`/users/${userId}`, {
        method: "DELETE",
        body: JSON.stringify(userData)
    });
}
