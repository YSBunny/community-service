import { getUser, updateUser, deleteUser } from './api/userApi.js';
import { logout } from './api/authApi.js';

document.addEventListener("DOMContentLoaded", async function () {
    const backButton = document.querySelector("#backButton");

    const profileMenuButton = document.querySelector("#profileMenuButton");
    const profileMenuButtonImage = document.querySelector("#profileMenuButtonImage");
    const profileDropdown = document.querySelector("#profileDropdown");

    const SERVER_URL = "http://localhost:8080";
    const DEFAULT_PROFILE_IMAGE = "./assets/images/profile.png";

     backButton.addEventListener("click", () => {
        window.location.href = `./posts.html`;
    });
    
    try {
        const user = await getUser(localStorage.getItem("userId"));

        profileMenuButtonImage.src = getProfileImageUrl(user.profileImage);
    } catch (error) {
        console.error(error);
        profileMenuButtonImage.src = DEFAULT_PROFILE_IMAGE;
    }

    // DB에 이미지 주소가 저장되어 있어도 실제 파일이 사라지거나 URL이 잘못될 수 있으므로 프로필 이미지 로딩 실패 처리
    profileMenuButton.addEventListener("error", () => {
        profileMenuButtonImage.src = DEFAULT_PROFILE_IMAGE;
    }, { once: true }); // 기본 이미지까지 로딩되지 않으면 error 이벤트가 반복될 수 있어서 한 번만 실행하도록 함

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

    // localStorage에서 userId 가져옴
    const userId = localStorage.getItem("userId");

    // user 정보를 백엔드에서 가져옴
    const user = await getUser(userId);

    // 화면의 이메일 요소를 가져와서 user의 이메일로 띄움
    const emailText = document.querySelector("#emailText");
    emailText.textContent = user.email;

    // 화면의 닉네임 폼을 가져와서 user의 닉네임으로 띄움
    const nicknameInput = document.querySelector("#nickname");
    nicknameInput.value = user.nickname;

    // 화면의 프로필 프리뷰를 가져와서 user의 프로필 이미지로 띄움
    const profilePreview = document.querySelector("#profilePreview");
    profilePreview.src = getProfileImageUrl(user.profileImage);

    const profileEditForm = document.querySelector("#profileEditForm");
    const profileImageInput = document.querySelector("#profileImage");
    const nicknameHelperText = document.querySelector("#nicknameHelperText");
    const editButton = document.querySelector("#editButton");

    profileEditForm.addEventListener("submit", async function (event) {
        // 2. 회원정보 수정 폼 제출 기본 동작 막음
        event.preventDefault();

        const userData = new FormData();

        userData.append("nickname", nicknameInput.value.trim());

        if (profileImageInput.files[0]) {
            userData.append("profileImage", profileImageInput.files[0]);
        }

        // 3. 닉네임 입력됐으면 회원정보 수정 가능
        if (!(userData.nickname === "")) {
            try {
                console.log("회원정보 수정 요청 데이터:", userData);

                const result = await updateUser(userId, userData);

                // 4. 수정완료 토스트 메시지 2초간 띄움
                const editCompleteToast = document.querySelector("#editCompleteToast");

                editCompleteToast.classList.remove("is-hidden");

                setTimeout(() => {
                    editCompleteToast.classList.add("is-hidden");
                }, 2000);

                profileMenuButtonImage.src = getProfileImageUrl(result.profileImage);
                nicknameInput.value = result.nickname;
                profilePreview.src = getProfileImageUrl(result.profileImage);
            } catch (error) {
                alert(error.message);
            }
        }
    });

    profileImageInput.addEventListener("change", () => {
        const selectedFile = profileImageInput.files[0];

        if (!selectedFile) {
            return;
        }

        if (!selectedFile.type.startsWith("image/")) {
            profileImageInput.value = "";
            return;
        }

        const imageUrl = URL.createObjectURL(selectedFile);

        profilePreview.src = imageUrl;

        editButton.disabled = false;
    });

    nicknameInput.addEventListener("input", () => {
        // 2. 닉네임 값 가져옴
        const nickname = nicknameInput.value.trim();

        // 3. 닉네임 값 여부에 따라 안내 문구와 수정하기 버튼 활성화 여부 결정
        if (nickname === "") {
            nicknameHelperText.textContent = "* 닉네임을 입력해주세요.";
            editButton.disabled = true;
        } else {
            nicknameHelperText.textContent = "";
            editButton.disabled = false;
        }
    });

    // 1. 회원 탈퇴 모달창 가져옴
    const withdrawButton = document.querySelector("#withdrawButton");

    // 2. 회원 탈퇴 이벤트 리스너 등록
    withdrawButton.addEventListener("click", () => {
        // 3. 회원 탈퇴 모달창 가져옴
        const withdrawModal = document.querySelector("#withdrawModal");

        // 4. 탈퇴 모달창의 is-hidden 클래스 제거
        withdrawModal.classList.remove("is-hidden");

        // 5. 탈퇴 모달창의 취소, 확인 버튼 가져옴
        const cancelWithdrawButton = document.querySelector("#cancelWithdrawButton");
        const confirmWithdrawButton = document.querySelector("#confirmWithdrawButton");

        // 6. 취소 버튼 누르면 모달창 사라짐
        cancelWithdrawButton.addEventListener("click", () => {
            withdrawModal.classList.add("is-hidden");
        });

        // 6. 삭제 버튼 누르면 회원 탈퇴하고 로그인 화면으로 돌아감
        confirmWithdrawButton.addEventListener("click", async (event) => {
            const userId = localStorage.getItem("userId");
            const userData = {
                token: localStorage.getItem("accessToken")
            };

            try {
                const result = await deleteUser(userId, userData);

                localStorage.removeItem("accessToken");
                localStorage.removeItem("userId");

                console.log(result);
            } catch (error) {
                alert(error.message);
            }
            
            // 다시 모달창 숨기고 로그인 화면으로 돌아감
            withdrawModal.classList.add("is-hidden");
            window.location.href = `./login.html`;
        });
    });

    function getProfileImageUrl(filename) {
        if (!filename) {
            return DEFAULT_PROFILE_IMAGE;
        }

        return `${SERVER_URL}/uploads/profiles/${encodeURIComponent(filename)}`;
    }
});
