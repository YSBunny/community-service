import { updatePassword } from "./api/userApi.js";

document.addEventListener("DOMContentLoaded", async function () {
    const profileMenuButton = document.querySelector("#profileMenuButton");
    const profileDropdown = document.querySelector("#profileDropdown");

    // 2. 프로필 메뉴 누르면 드롭다운 보이게
    profileMenuButton.addEventListener("click", () => {
        profileDropdown.classList.toggle("is-hidden");
    });

    // 3. 드롭다운의 회원정보 수정 버튼 가져옴
    const profileEditButton = document.querySelector("#profileEditButton");

    // 4. 드롭다운 회원정보 수정 버튼 누르면 다시 회원정보 수정 페이지 로드
    profileEditButton.addEventListener("click", () => {
        window.location.href = `./profile-edit.html`;
    });

    // 3. 드롭다운의 비밀번호 수정 버튼 가져옴
    const passwordEditButton = document.querySelector("#passwordEditButton");

    // 4. 드롭다운 비밀번호 수정 버튼 누르면 비밀번호 수정 페이지로 이동
    passwordEditButton.addEventListener("click", () => {
        window.location.href = `./password-edit.html`;
    });

    // 3. 드롭다운의 로그아웃 버튼 가져옴
    const logoutButton = document.querySelector("#logoutButton");

    // 4. 드롭다운 로그아웃 버튼 누르면 로그아웃 후 로그인 페이지로 이동
    logoutButton.addEventListener("click", async () => {
        try {
            await logout();

            localStorage.removeItem("accessToken");
            localStorage.removeItem("userId");

            window.location.href = `./login.html`;
        } catch (error) {
            alert(error.message);
        }
    });

    // 1. 비밀번호 수정 폼, 비밀번호, 비밀번호 확인 값, 안내 문구들, 수정하기 버튼 가져옴
    const passwordEditForm = document.querySelector("#passwordEditForm");
    const passwordInput = document.querySelector("#password");
    const passwordConfirmInput = document.querySelector("#passwordConfirm");
    const passwordPattern =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,20}$/;
    const passwordHelperText = document.querySelector("#passwordHelperText");
    const passwordConfirmHelperText = document.querySelector("#passwordConfirmHelperText");
    const editButton = document.querySelector("#editButton");

    passwordEditForm.addEventListener("submit", async function (event) {
        // 2. 비밀번호 수정 폼 제출 기본 동작 막음
        event.preventDefault();

        const userId = localStorage.getItem("userId");
        const userData = {
            password: passwordInput.value.trim()
        };

        const passwordConfirm = passwordConfirmInput.value.trim();

        // 3. 비밀번호 값, 비밀번호 확인 값 입력됐으면 비밀번호 수정 가능
        if (!(userData.password === "" || passwordConfirm === "")) {
            try {
                const result = await updatePassword(userId, userData);

                console.log(result);
            } catch (error) {
                alert(error.message);
            }

            // 4. 수정완료 토스트 메시지 2초간 띄움
            const passwordEditToast = document.querySelector("#passwordEditToast");

            passwordEditToast.classList.remove("is-hidden");

            setTimeout(() => {
                passwordEditToast.classList.add("is-hidden");
            }, 2000);
        }
    });

    function checkPasswordEditForm() {
        // 4. 비밀번호 값, 비밀번호 확인 값 가져옴
        const password = passwordInput.value.trim();
        const passwordConfirm = passwordConfirmInput.value.trim();

        // 5. 비밀번호과 비밀번호 확인 모두 작성 되었으면 제출 버튼 보이게, 하나라도 작성 안 되어있으면 제출 버튼 안 보이게 함
        if (
            password !== "" && passwordConfirm !== "" && passwordPattern.test(password)
            && password === passwordConfirm
        ) {
            editButton.disabled = false;
        } else {
            editButton.disabled = true;
        }
    }

    passwordInput.addEventListener("input", () => {
        // 2. 비밀번호 값 가져옴
        const password = passwordInput.value.trim();

        // 3. 비밀번호 값 여부에 따라 안내 문구 여부 결정
        if (password === "") {
            passwordHelperText.textContent = "* 비밀번호를 입력해주세요.";
        } else if (!passwordPattern.test(password)) {
            passwordHelperText.textContent =
                "* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
        } else {
            passwordHelperText.textContent = "";
        }

        checkPasswordEditForm();
    });

    passwordConfirmInput.addEventListener("input", () => {
        // 2. 비밀번호 확인 값 가져옴
        const password = passwordInput.value.trim();
        const passwordConfirm = passwordConfirmInput.value.trim();

        // 3. 비밀번호 확인 값 여부에 따라 안내 문구 여부 결정
        if (passwordConfirm === "") {
            passwordConfirmHelperText.textContent = "* 비밀번호 확인을 입력해주세요.";
        } else if (password !== passwordConfirm) {
                passwordConfirmHelperText.textContent = "* 비밀번호가 다릅니다.";
        } else {
            passwordConfirmHelperText.textContent = "";
        }

        checkPasswordEditForm();
    });
});
