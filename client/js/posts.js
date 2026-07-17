import { getUser } from './api/userApi.js';
import { getPosts } from './api/postApi.js';
import { logout } from './api/authApi.js';

// 0. HTML이 다 로드된 뒤 이벤트 리스너를 등록
document.addEventListener("DOMContentLoaded", async function () {
    const profileMenuButton = document.querySelector("#profileMenuButton");
    const profileMenuButtonImage = document.querySelector("#profileMenuButtonImage");
    const profileDropdown = document.querySelector("#profileDropdown");

    const postList = document.querySelector("#postList");

    const SERVER_URL = "http://localhost:8080";
    const DEFAULT_PROFILE_IMAGE = "./assets/images/profile.png";

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

    try {
        const result = await getPosts();
        const posts = result.posts;

        console.log("게시글 목록 응답:", posts);

        posts.forEach((post) => {
            const article = document.createElement("article");
            article.classList.add("post-card");
            article.dataset.postId = post.postId;

            const content = document.createElement("div");
            content.classList.add("post-card__content");

            const top = document.createElement("div");
            top.classList.add("post-card__top");

            const titleArea = document.createElement("div");

            const title = document.createElement("h2");
            title.classList.add("post-card__title");
            title.textContent = post.title;

            const meta = document.createElement("div");
            meta.classList.add("post-card__meta");

            // const like = document.createElement("span");
            // like.textContent = "좋아요 0";

            const comment = document.createElement("span");
            comment.textContent = `댓글수 ${post.commentCount}`;

            // const view = document.createElement("span");
            // view.textContent = "조회수 0";

            // meta.appendChild(like);
            meta.appendChild(comment);
            // meta.appendChild(view);

            titleArea.appendChild(title);
            titleArea.appendChild(meta);

            const date = document.createElement("time");
            date.classList.add("post-card__date");
            date.textContent = post.createdAt;

            top.appendChild(titleArea);
            top.appendChild(date);

            content.appendChild(top);

            const author = document.createElement("div");
            author.classList.add("post-card__author");

            const authorProfileImage = document.createElement("img");
            authorProfileImage.classList.add("author-profile");
            authorProfileImage.src = getProfileImageUrl(post.authorProfileImage);
            authorProfileImage.alt = `${post.authorNickname}의 프로필 이미지`;

            authorProfileImage.addEventListener("error", () => {
                authorProfileImage.src = DEFAULT_PROFILE_IMAGE;
            }, { once: true });

            const authorName = document.createElement("span");
            authorName.classList.add("author-name");
            authorName.textContent = post.authorNickname;

            author.appendChild(authorProfileImage);
            author.appendChild(authorName);

            article.appendChild(content);
            article.appendChild(author);

            postList.appendChild(article);
        });
    } catch (error) {
        alert(error.message);
    }

    postList.addEventListener("click", (event) => {
        const postCard = event.target.closest(".post-card");

        if (!postCard) {
            return;
        }

        const postId = postCard.dataset.postId;

        window.location.href = `./post-detail.html?postId=${postId}`;
    });

    // 1. html의 id="writePostButton"인 게시글 요소 가져옴
    const writePostButton = document.querySelector("#writePostButton");

    // 2. 버튼에 이벤트 리스너 등록
    writePostButton.addEventListener("click", (event) => {
        // 3. 게시글 작성 페이지로 넘어감
        window.location.href = `./post-form.html`;
    })

    function getProfileImageUrl(filename) {
        if (!filename) {
            return DEFAULT_PROFILE_IMAGE;
        }

        return `${SERVER_URL}/uploads/profiles/${encodeURIComponent(filename)}`;
    }
});
