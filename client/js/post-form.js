import { getUser } from './api/userApi.js';
import { createPost, getPost, updatePost } from "./api/postApi.js";
import { logout } from './api/authApi.js';

// 0. HTML이 다 로드된 뒤 이벤트 리스너를 등록
document.addEventListener("DOMContentLoaded", async function () {
    const backButton = document.querySelector("#backButton");

    const profileMenuButton = document.querySelector("#profileMenuButton");
    const profileMenuButtonImage = document.querySelector("#profileMenuButtonImage");
    const profileDropdown = document.querySelector("#profileDropdown");

    // 1. 게시글 폼, 제목 폼, 내용 폼, 안내 문구 가져옴
    const postForm = document.querySelector("#postForm");
    const titleInput = document.querySelector("#title");
    const contentInput = document.querySelector("#content");
    const postImageInput = document.querySelector("#postImage");
    const currentImageName = document.querySelector("#currentImageName");
    const helperText = document.querySelector("#helperText");

    const SERVER_URL = "http://localhost:8080";
    const DEFAULT_PROFILE_IMAGE = "./assets/images/profile.png";

    // 1. URL 파라미터 가져옴
    const params = new URLSearchParams(window.location.search);

    // 2. postID 값과 mode 값 가져옴
    const postId = params.get("postId");
    const mode = params.get("mode");

    // 3. 폼 제목과 제출 버튼 문구 가져옴
    const formTitle = document.querySelector("#formTitle");
    const submitButton = document.querySelector("#submitButton");

    backButton.addEventListener("click", () => {
        if (mode === "edit") {
            window.location.href = `./post-detail.html?postId=${postId}`;
        } else {
            window.location.href = `./posts.html`;
        }
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

    // 수정 모드라면 폼 제목과 버튼 문구 수정하고 해당 게시글 데이터 불러오기
    if (mode === "edit") {
        formTitle.textContent = "게시글 수정";
        submitButton.textContent = "수정하기";

        try {
            const post = await getPost(postId);

            titleInput.value = post.title;
            contentInput.value = post.content;

            if (post.postImage !== null) {
                currentImageName.textContent = `현재 이미지: ${post.postImage}`;

                currentImageName.classList.remove("is-hidden");
            }
        } catch (error) {
            console.error(error);
        }
    }

    // 입력 폼이 포커스 되었었는지
    let isTitleFocused = false;
    let isContentFocused = false;

    postForm.addEventListener("submit", async (event) => {
        // 2. 게시글 작성 폼 제출 기본 동작 막음
        event.preventDefault();

        const postImageFile = postImageInput.files[0];

        const postData = new FormData();

        postData.append("title", titleInput.value.trim());
        postData.append("content", contentInput.value.trim());
        
        if (postImageFile) {
            postData.append("postImage", postImageFile);
        }
        
        // 4. 제목, 내용 모두 입력되어서 폼 제출 가능
        if (postData.title !== "" && postData.content !== "") {
            if (mode === "edit") {
                const result = await updatePost(postId, postData);

                console.log(result);

                window.location.href = `./post-detail.html?postId=${postId}`;
            } else {
                const result = await createPost(postData);

                const postId = result.postId;

                console.log(result);

                window.location.href = `./post-detail.html?postId=${postId}`;
            }
        }
    });

    function checkPostForm() {
        // 2. 제목 값, 내용 값 가져옴
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();

        // 3. 제목 폼, 내용 폼이 모두 입력되었었는데 둘 중 하나라도 값이 비면 안내 문구 띄움
        if (isTitleFocused && isContentFocused && (title === "" || content === "")) {
            helperText.textContent = "* 제목, 내용을 모두 작성해주세요.";
        }

        // 4. 제목과 내용 모두 작성 되었으면 제출 버튼 보이게, 하나라도 작성 안 되어있으면 제출 버튼 안 보이게 함
        if (title !== "" && content !== "") {
            helperText.textContent = "";
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    }

    titleInput.addEventListener("input", () => {
        // 제목 폼이 최소 한 번 입력됨
        isTitleFocused = true;

        checkPostForm()
    });

    contentInput.addEventListener("input", () => {
        // 내용 폼이 최소 한 번 입력됨
        isContentFocused = true;
        
        checkPostForm()
    });

    postImageInput.addEventListener("change", () => {
        const selectedFile = postImageInput.files[0];

        if (!selectedFile) {
            return;
        }

        // currentImageName.textContent = `선택한 이미지: ${selectedFile.name}`;

        currentImageName.classList.remove("is-hidden");
        
        if (mode === "edit") {
            submitButton.disabled = false;
        }
    });

    function getProfileImageUrl(filename) {
        if (!filename) {
            return DEFAULT_PROFILE_IMAGE;
        }

        return `${SERVER_URL}/uploads/profiles/${encodeURIComponent(filename)}`;
    }

    function getPostImageUrl(filename) {
        if (!filename) {
            return DEFAULT_PROFILE_IMAGE;
        }

        return `${SERVER_URL}/uploads/posts/${encodeURIComponent(filename)}`;
    }
});
