import { signup } from "./api/userApi.js";

document.addEventListener("DOMContentLoaded", function () {
    const backButton = document.querySelector("#backButton");

    const signupForm = document.querySelector("#signupForm");

    const profileImageInput = document.querySelector("#profileImage");
    const profilePreview = document.querySelector("#profilePreview");
    const profilePlus = document.querySelector("#profilePlus");
    const emailInput = document.querySelector("#email");
    const passwordInput = document.querySelector("#password");
    const passwordConfirmInput = document.querySelector("#passwordConfirm");
    const nicknameInput = document.querySelector("#nickname");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,20}$/;

    const profileHelperText = document.querySelector("profileHelperText");
    const emailHelperText = document.querySelector("#emailHelperText");
    const passwordHelperText = document.querySelector("#passwordHelperText");
    const passwordConfirmHelperText = document.querySelector("#passwordConfirmHelperText");
    const nicknameHelperText = document.querySelector("#nicknameHelperText");

    const signupButton = document.querySelector("#signupButton");

    backButton.addEventListener("click", () => {
        window.location.href = `./login.html`;
    });

    signupForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const profileImageFile = profileImageInput.files[0];

        const userData = new FormData();
        
        userData.append("email", emailInput.value.trim());
        userData.append("password", passwordInput.value.trim());
        userData.append("nickname", nicknameInput.value.trim());

        if (profileImageFile) {
            userData.append("profileImage", profileImageFile);
        }

        console.log("회원가입 요청 데이터:", userData);
        
        // 3. 이메일, 비밀번호, 비밀번호 확인, 닉네임 모두 입력됐으면 회원가입 가능
        if (
            !(userData.email === "" || userData.password === ""
            || userData.passwordConfirm === "" || userData.nickname === "")
        ) {
            try {
                // userData 객체를 백엔드에 보내고 받은 JSON userId를 result에 저장
                const result = await signup(userData);

                console.log(`userId: ${result}`);
                
                // 4. 로그인 페이지로 이동
                window.location.href = `./login.html`;
            } catch (error) {
                alert(error.message);
            }  
        }
    });

    function checkPostForm() {
        // 2. 이메일 값, 비밀번호 값, 비밀번호 확인 값, 닉네임 값 가져옴
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const passwordConfirm = passwordConfirmInput.value.trim();
        const nickname = nicknameInput.value.trim();

        // 3. 이메일, 비밀번호, 비밀번호 확인, 닉네임 모두 있으면 회원가입 버튼 활성화
        if (
            email !== "" && password !== "" && passwordConfirm !== "" && nickname !== ""
            && emailPattern.test(email) && passwordPattern.test(password)
            && password === passwordConfirm
        ) {
            signupButton.disabled = false;
        } else {
            signupButton.disabled = true;
        }
    }

    profileImageInput.addEventListener("change", () => {
        const selectedFile = profileImageInput.files[0];

        if (!selectedFile) {
            return;
        }

        if (!selectedFile.type.startsWith("image/")) {
            profileHelperText.textContent = "* 이미지 파일을 선택해주세요.";
            profileImageInput.value = "";
            return;
        }

        const imageUrl = URL.createObjectURL(selectedFile);

        profilePreview.src = imageUrl;
        profilePreview.classList.remove("is-hidden");
        profilePlus.classList.add("is-hidden");
        // profileHelperText.textContent = "";
    });

    emailInput.addEventListener("input", () => {
        const email = emailInput.value.trim();

        checkPostForm();

        // 4. 이메일 값 여부에 따라 안내 문구 여부 변경
        if (email === "") {
            emailHelperText.textContent = "* 이메일을 입력해주세요.";
        } else if (!emailPattern.test(email)) {
            emailHelperText.textContent = "* 올바른 이메일 주소 형식을 입력해주세요.";
        } else {
            emailHelperText.textContent = "";
        }
    });

    passwordInput.addEventListener("input", () => {
        const password = passwordInput.value.trim();

        checkPostForm();

        // 4. 비밀번호 값 여부에 따라 안내 문구 여부 변경
        if (password === "") {
            passwordHelperText.textContent = "* 비밀번호을 입력해주세요.";
        } else if (!passwordPattern.test(password)) {
            passwordHelperText.textContent =
                "* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
        } else {
            passwordHelperText.textContent = "";
        }
    });

    passwordConfirmInput.addEventListener("input", () => {
        const password = passwordInput.value.trim();
        const passwordConfirm = passwordConfirmInput.value.trim();

        checkPostForm();

        // 4. 비밀번호 확인 값 여부에 따라 안내 문구 여부 변경
        if (passwordConfirm === "") {
            passwordConfirmHelperText.textContent = "* 비밀번호 확인을 입력해주세요.";
        } else if (password !== passwordConfirm) {
            passwordConfirmHelperText.textContent = "* 비밀번호가 다릅니다.";
        } else {
            passwordConfirmHelperText.textContent = "";
        }
    });

    nicknameInput.addEventListener("input", () => {
        const nickname = nicknameInput.value.trim();

        checkPostForm();

        // 4. 닉네임 값 여부에 따라 안내 문구 여부 변경
        if (nickname === "") {
            nicknameHelperText.textContent = "* 닉네임을 입력해주세요.";
        } else {
            nicknameHelperText.textContent = "";
        }
    });

    // 1. 로그인하러 가기 버튼 가져옴
    const loginButton = document.querySelector("#loginButton");

    // 2. 로그인하러 가기 버튼 클릭하면 로그인 페이지로 이동
    loginButton.addEventListener("click", () => {
        window.location.href = `./login.html`;
    });
});
