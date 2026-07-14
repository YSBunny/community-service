import { login } from "./api/authApi.js";
 
const loginForm = document.querySelector("#loginForm");

const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emailHelperText = document.querySelector("#emailHelperText");
const passwordHelperText = document.querySelector("#passwordHelperText");

const loginButton = document.querySelector("#loginButton");

loginForm.addEventListener("submit", async (event) => {
    // 2. 로그인 폼 제출 기본 동작 막음
    event.preventDefault();

    // 이메일 값, 비밀번호 값 가져와서 loginData 객체 생성
    const loginData = {
        email: emailInput.value.trim(),
        password: passwordInput.value.trim()
    }

    console.log("로그인 요청 데이터:", loginData);

    // 4. 이메일과 비밀번호 모두 값이 있을 때 로그인되어 게시글 목록으로 이동
    if (loginData.email !== "" && loginData.password !== "") {
        try {
            // loginData 객체를 백엔드에 보내고 받은 JSON userId와 토큰을 result에 저장
            const result = await login(loginData);

            console.log("로그인 응답:", result);

            localStorage.setItem("userId", result.userId);
            localStorage.setItem("accessToken", result.token);

            console.log("저장된 userId:", localStorage.getItem("userId"));
            console.log("저장된 accessToken:", localStorage.getItem("accessToken"));

            window.location.href = `./posts.html`;
        } catch (error) {
            alert(error.message);
        }
    }
});

emailInput.addEventListener("input", () => {
    // 2. 이메일 값, 비밀번호 값 가져옴
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    // 3. 이메일 값 여부에 따라 안내 문구 여부 변경
    if (email === "") {
        emailHelperText.textContent = "* 이메일을 입력해주세요.";
    } else if (!emailPattern.test(email)) {
            emailHelperText.textContent = "* 올바른 이메일 주소 형식을 입력해주세요.";
    } else {
        emailHelperText.textContent = "";
    }

    // 4. 이메일과 비밀번호 값 둘 다 있으면 로그인 버튼 활성화
    if (email !== "" && password !== "" && emailPattern.test(email)) {
        loginButton.disabled = false;
    } else {
        loginButton.disabled = true;
    }
});

passwordInput.addEventListener("input", () => {
    // 2. 이메일 값, 비밀번호 값 가져옴
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // 3. 비밀번호 값 여부에 따라 안내 문구 여부 변경
    if (password === "") {
        passwordHelperText.textContent = "* 비밀번호를 입력해주세요.";
    } else {
        passwordHelperText.textContent = "";
    }

    // 4. 이메일과 비밀번호 값 둘 다 있으면 로그인 버튼 활성화
    if (email !== "" && password !== "" && emailPattern.test(email)) {
        loginButton.disabled = false;
    } else {
        loginButton.disabled = true;
    }
});

// 1. 회원가입 버튼 가져옴
const signupButton = document.querySelector("#signupButton");

signupButton.addEventListener("click", function () {
    // 2. 회원가입 페이지로 이동
    window.location.href = `./signup.html`;
});
