import { logout } from "./api/authApi.js";
import { getUser } from "./api/userApi.js";
import { getPost, deletePost } from "./api/postApi.js";
import { createComment, getComments, updateComment, deleteComment } from "./api/commentApi.js";

document.addEventListener("DOMContentLoaded", async function () {
    const SERVER_URL = "http://localhost:8080";
    const DEFAULT_PROFILE_IMAGE = "./assets/images/profile.png";

    // 헤더 요소
    const backButton = document.querySelector("#backButton");
    const profileMenuButton = document.querySelector("#profileMenuButton");
    const profileMenuButtonImage = document.querySelector("#profileMenuButtonImage");
    const profileDropdown = document.querySelector("#profileDropdown");
    const profileEditButton = document.querySelector("#profileEditButton");
    const passwordEditButton = document.querySelector("#passwordEditButton");
    const logoutButton = document.querySelector("#logoutButton");

    // 게시글 요소
    const postAuthorProfileImage = document.querySelector("#postAuthorProfileImage");
    const postAuthorNickname = document.querySelector("#postAuthorNickname");
    const postDate = document.querySelector("#postDate");
    const postTitle = document.querySelector("#postTitle");
    const postImage = document.querySelector("#postImage");
    const postContent = document.querySelector("#postContent");
    const editPostButton = document.querySelector("#editPostButton");
    const deletePostButton = document.querySelector("#deletePostButton");

    // 댓글 요소
    const commentForm = document.querySelector("#commentForm");
    const commentInput = document.querySelector("#commentInput");
    const commentSubmitButton = document.querySelector("#commentSubmitButton");
    const commentList = document.querySelector("#commentList");
    const commentCount = document.querySelector("#commentCount");

    // 게시글 삭제 모달
    const deletePostModal = document.querySelector("#deletePostModal");
    const cancelDeleteButton = document.querySelector("#cancelDeleteButton");
    const confirmDeleteButton = document.querySelector("#confirmDeleteButton");

    // 댓글 삭제 모달
    const deleteCommentModal = document.querySelector("#deleteCommentModal");
    const cancelDeleteCommentButton = document.querySelector("#cancelDeleteCommentButton");
    const confirmDeleteCommentButton = document.querySelector("#confirmDeleteCommentButton");

    // URL에서 postId 가져오기
    const params = new URLSearchParams(window.location.search);
    const postId = params.get("postId");

    // 현재 삭제 대상으로 선택된 댓글 id
    let deletingCommentId = null;

    /*
    * 프로필 이미지 조회
    */
    try {
        const userId = localStorage.getItem("userId");
        const user = await getUser(userId);

        profileMenuButtonImage.src = getProfileImageUrl(user.profileImage);
    } catch (error) {
        console.error(error);

        profileMenuButtonImage.src = DEFAULT_PROFILE_IMAGE;
    }

    // 프로필 이미지 로딩 실패 처리
    profileMenuButtonImage.addEventListener("error", () => {
        profileMenuButtonImage.src = DEFAULT_PROFILE_IMAGE;
        }, { once: true });

    /*
    * 헤더 이벤트
    */
    backButton.addEventListener("click", () => {
        window.location.href = "./posts.html";
    });

    profileMenuButton.addEventListener("click", () => {
        profileDropdown.classList.toggle("is-hidden");
    });

    profileEditButton.addEventListener("click", () => {
        window.location.href = "./profile-edit.html";
    });

    passwordEditButton.addEventListener("click", () => {
        window.location.href = "./password-edit.html";
    });

    logoutButton.addEventListener("click", async () => {
        try {
            await logout();

            localStorage.removeItem("accessToken");
            localStorage.removeItem("userId");

            window.location.href = "./login.html";
        } catch (error) {
            alert(error.message);
        }
    });

    /*
    * 게시글 상세 조회
    */
    try {
        const post = await getPost(postId);

        postAuthorProfileImage.src = getProfileImageUrl(post.authorProfileImage);
        postAuthorProfileImage.alt = `${post.authorNickname}의 프로필 이미지`;
        postAuthorNickname.textContent = post.authorNickname;
        postDate.textContent = post.createdAt;

        postTitle.textContent = post.title;
        postContent.textContent = post.content;

        if (post.postImage) {
            postImage.src = getPostImageUrl(post.postImage);
            postImage.classList.remove("is-hidden");
        } else {
            postImage.removeAttribute("src");
            postImage.classList.add("is-hidden");
        }
    } catch (error) {
        alert(error.message);
    }
    
    postAuthorProfileImage.addEventListener("error", () => {
        postAuthorProfileImage.src = DEFAULT_PROFILE_IMAGE;
    }, { once: true });

    /*
    * 게시글 수정
    */
    editPostButton.addEventListener("click", () => {
        window.location.href = `./post-form.html?postId=${postId}&mode=edit`;
    });

    /*
    * 게시글 삭제 모달 열기
    */
    deletePostButton.addEventListener("click", () => {
        openModal(deletePostModal);
    });

    /*
    * 게시글 삭제 취소
    */
    cancelDeleteButton.addEventListener("click", () => {
        closeModal(deletePostModal);
    });

    /*
    * 게시글 삭제 확인
    */
    confirmDeleteButton.addEventListener("click", async () => {
        try {
            await deletePost(postId);

            closeModal(deletePostModal);

            window.location.href = "./posts.html";
        } catch (error) {
            alert(error.message);
        }
    });

    /*
    * 댓글 입력값에 따른 버튼 활성화
    */
    commentInput.addEventListener("input", () => {
        const comment = commentInput.value.trim();

        commentSubmitButton.disabled =
        comment === "";
    });

    /*
    * 댓글 등록 또는 수정
    */
    commentForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const commentData = {
            comment: commentInput.value.trim()
        };

        if (commentData.comment === "") {
            return;
        }

        try {
            if (commentForm.dataset.mode === "edit") {
                await updateComment(postId, commentForm.dataset.commentId, commentData);
            } else {
                await createComment(postId, commentData);
            }

            window.location.reload();
        } catch (error) {
            alert(error.message);
        }
    });

    /*
    * 댓글 목록 조회
    */
    try {
        const result = await getComments(postId);
        const comments = result.comments;

        commentCount.textContent = comments.length;

        comments.forEach((comment) => {
            const commentItem = createCommentItem(comment);

            commentList.appendChild(commentItem);
        });
    } catch (error) {
        alert(error.message);
    }

    /*
    * 댓글 수정·삭제 버튼 이벤트 위임
    */
    commentList.addEventListener("click", (event) => {
        const commentItem = event.target.closest(".comment-item");

        if (!commentItem) {
            return;
        }

        const commentId = commentItem.dataset.commentId;

        /*
        * 댓글 수정 버튼
        */
        if (event.target.closest(".comment-edit-button")) {
            const commentContent = commentItem.querySelector(".comment-content");

            commentInput.value = commentContent.textContent;

            commentForm.dataset.mode = "edit";
            commentForm.dataset.commentId = commentId;

            commentSubmitButton.textContent = "댓글 수정";

            commentSubmitButton.disabled = false;

            return;
        }

        /*
        * 댓글 삭제 버튼
        */
        if (event.target.closest(".comment-delete-button")) {
            deletingCommentId = commentId;

            openModal(deleteCommentModal);
        }
    });

    /*
    * 댓글 삭제 취소
    */
    cancelDeleteCommentButton.addEventListener("click", () => {
        deletingCommentId = null;

        closeModal(deleteCommentModal);
    });

    /*
    * 댓글 삭제 확인
    */
    confirmDeleteCommentButton.addEventListener("click", async () => {
        if (!deletingCommentId) {
            return;
        }

        try {
            await deleteComment(postId, deletingCommentId);

            closeModal(deleteCommentModal);

            window.location.reload();
        } catch (error) {
            alert(error.message);
        }
    });

    /*
    * 댓글 하나의 DOM 생성
    *
    * 댓글은 API 응답 개수에 따라 달라지므로
    * 댓글 item만 JS에서 동적으로 생성
    */
    function createCommentItem(comment) {
        const article = document.createElement("article");

        article.classList.add("comment-item");
        article.dataset.commentId = comment.commentId;

        article.innerHTML = `
            <div class="comment-header">
                <div class="author-info">
                    <img class="profile-button comment-author-profile-image" />

                    <strong class="author-name comment-author-nickname"></strong>

                    <time class="comment-date"></time>
                </div>

                <div class="comment-actions">
                    <button
                        type="button"
                        class="small-button comment-edit-button"
                    >
                        수정
                    </button>

                    <button
                        type="button"
                        class="small-button comment-delete-button"
                    >
                        삭제
                    </button>
                </div>
            </div>

            <p class="comment-content"></p>
        `;

        const commentAuthorProfileImage =
            article.querySelector(".comment-author-profile-image");

        const commentAuthorNickname = article.querySelector(".comment-author-nickname");

        const commentDate = article.querySelector(".comment-date");

        const commentContent = article.querySelector(".comment-content");

        commentAuthorProfileImage.src = getProfileImageUrl(comment.authorProfileImage);

        commentAuthorProfileImage.alt = `${comment.authorNickname}의 프로필 이미지`;

        commentAuthorProfileImage.addEventListener("error", () => {
                commentAuthorProfileImage.src = DEFAULT_PROFILE_IMAGE;
            }, { once: true });

        commentAuthorNickname.textContent = comment.authorNickname;

        commentDate.textContent = comment.createdAt;

        commentContent.textContent = comment.commentContent;

        return article;
    }

    /*
    * 모달 열기
    */
    function openModal(modal) {
        modal.classList.remove("is-hidden");
        document.body.classList.add("modal-open");
    }

    /*
    * 모달 닫기
    */
    function closeModal(modal) {
        modal.classList.add("is-hidden");
        document.body.classList.remove("modal-open");
    }

    /*
    * 프로필 이미지 URL 생성
    */
    function getProfileImageUrl(filename) {
        if (!filename) {
            return DEFAULT_PROFILE_IMAGE;
        }

        return (`${SERVER_URL}/uploads/profiles/` + encodeURIComponent(filename));
    }

    /*
    * 게시글 이미지 URL 생성
    */
    function getPostImageUrl(filename) {
        if (!filename) {
            return null;
        }

        return (`${SERVER_URL}/uploads/posts/` + encodeURIComponent(filename));
    }
});
