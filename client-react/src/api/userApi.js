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
