import { getUser } from './api/userApi.js';
import { getPost, deletePost } from './api/postApi.js';
import { createComment, getComments, updateComment, deleteComment } from './api/commentApi.js';

// 0. HTML이 다 로드된 뒤 이벤트 리스너를 등록
document.addEventListener("DOMContentLoaded", async function () {
    const backButton = document.querySelector("#backButton");

    const profileMenuButton = document.querySelector("#profileMenuButton");
    const profileDropdown = document.querySelector("#profileDropdown");

    const DEFAULT_PROFILE_IMAGE = "./asset/images/profile.png";

    try {
        const user = await getUser(localStorage.getItem("userId"));

        profileMenuButton.src = user.profileImage || DEFAULT_PROFILE_IMAGE;
    } catch (error) {
        console.error(error);
        profileMenuButton.src = DEFAULT_PROFILE_IMAGE;
    }

    // DB에 이미지 주소가 저장되어 있어도 실제 파일이 사라지거나 URL이 잘못될 수 있으므로 프로필 이미지 로딩 실패 처리
    profileMenuButton.addEventListener("error", () => {
        profileMenuButton.src = DEFAULT_PROFILE_IMAGE;
    }, { once: true }); // 기본 이미지까지 로딩되지 않으면 error 이벤트가 반복될 수 있어서 한 번만 실행하도록 함
    
    backButton.addEventListener("click", () => {
        window.location.href = `./posts.html`;
    });

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

    // 1. URL 파라미터 가져옴
    const params = new URLSearchParams(window.location.search);

    // 2. postId 값 가져옴
    const postId = params.get("postId");

    const main = document.querySelector(".main");

    try {
        const post = await getPost(postId);

        console.log(post);

        const article = document.createElement("article");
        article.classList.add("post-detail");

        const header = document.createElement("section");
        header.classList.add("post-header");

        const title = document.createElement("h2");
        title.classList.add("post-title");
        title.id = "postTitle";
        title.textContent = post.title;

        const postInfoRow = document.createElement("div");
        postInfoRow.classList.add("post-info-row");

        const authorInfo = document.createElement("div");
        authorInfo.classList.add("author-info");

        const authorProfile = document.createElement("div");
        authorProfile.classList.add("author-profile");

        const authorName = document.createElement("strong");
        authorName.classList.add("author-name");
        authorName.id = "postAuthor";
        authorName.textContent = "더미 작성자 1";

        const date = document.createElement("time");
        date.classList.add("post-date");
        date.id = "postDate";
        date.textContent = "2021-01-01 00:00:00";

        authorInfo.appendChild(authorProfile);
        authorInfo.appendChild(authorName);
        authorInfo.appendChild(date);

        const actions = document.createElement("div");
        actions.classList.add("post-actions");

        const editPostButton = document.createElement("button");
        editPostButton.type = "button";
        editPostButton.classList.add("small-button");
        editPostButton.id = "editPostButton";
        editPostButton.textContent = "수정";

        editPostButton.addEventListener("click", (event) => {
            window.location.href = `./post-form.html?postId=${postId}&mode=edit`;
        });

        const deletePostButton = document.createElement("button");
        deletePostButton.type = "button";
        deletePostButton.classList.add("small-button");
        deletePostButton.id = "deletePostButton";
        deletePostButton.textContent = "삭제";

        deletePostButton.addEventListener("click", () => {
            // 3. 삭제 모달창 가져옴
            const deletePostModal = document.querySelector("#deletePostModal");

            // 4. 삭제 모달창 띄우고 배경 스크롤 불가능
            deletePostModal.classList.remove("is-hidden");
            document.body.classList.add("modal-open");

            // 5. 삭제 모달창의 취소, 확인 버튼 가져옴
            const cancelDeleteButton = document.querySelector("#cancelDeleteButton");
            const confirmDeleteButton = document.querySelector("#confirmDeleteButton");

            // 6. 취소 버튼 누르면 모달창 숨기고 배경 스크롤 가능
            cancelDeleteButton.addEventListener("click", () => {
                deletePostModal.classList.add("is-hidden");
                document.body.classList.remove("modal-open");
            });

            // 6. 삭제 버튼 누르면 게시글 삭제하고 게시글 목록으로 돌아감
            confirmDeleteButton.addEventListener("click", (event) => {
                // 게시글 삭제
                const result = deletePost(postId);

                console.log(result);

                // 7. 다시 모달창 숨기고 배경 스크롤 가능
                deletePostModal.classList.add("is-hidden");
                document.body.classList.remove("modal-open");

                // 8. 게시글 목록으로 돌아감
                window.location.href = `./posts.html`;
            });
        });

        actions.appendChild(editPostButton);
        actions.appendChild(deletePostButton);

        postInfoRow.appendChild(authorInfo);
        postInfoRow.appendChild(actions);

        header.appendChild(title);
        header.appendChild(postInfoRow);

        const body = document.createElement("section");
        body.classList.add("post-body");

        const image = document.createElement("div");
        image.classList.add("post-image");
        image.ariaLabel = "게시글 이미지 영역";

        const content = document.createElement("p");
        content.classList.add("post-content");
        content.id = "postContent";
        content.textContent = post.content;

        const stats = document.createElement("div");
        stats.classList.add("post-stats");

        const likeBox = document.createElement("div");
        likeBox.classList.add("stat-box");

        const likeCount = document.createElement("strong");
        likeCount.id = "likeCount";
        likeCount.textContent = "123";

        const like = document.createElement("span");
        like.textContent = "좋아요수";

        likeBox.appendChild(likeCount);
        likeBox.appendChild(like);

        const viewBox = document.createElement("div");
        viewBox.classList.add("stat-box");

        const viewCount = document.createElement("strong");
        viewCount.id = "viewCount";
        viewCount.textContent = "123";

        const view = document.createElement("span");
        view.textContent = "조회수";

        viewBox.appendChild(viewCount);
        viewBox.appendChild(view);

        const commentBox = document.createElement("div");
        commentBox.classList.add("stat-box");

        const commentCount = document.createElement("strong");
        commentCount.id = "commentCount";
        commentCount.textContent = "123";

        const comment = document.createElement("span");
        comment.textContent = "댓글수";

        commentBox.appendChild(commentCount);
        commentBox.appendChild(comment);

        stats.appendChild(likeBox);
        stats.appendChild(viewBox);
        stats.appendChild(commentBox);

        body.appendChild(image);
        body.appendChild(content);
        body.appendChild(stats);

        article.appendChild(header);
        article.appendChild(body);

        const commentSection = document.createElement("section");
        commentSection.classList.add("comment-section");

        const commentForm = document.createElement("form");
        commentForm.classList.add("comment-form");
        commentForm.id = "commentForm";
        commentForm.dataset.mode = "create";

        const commentInput = document.createElement("textarea");
        commentInput.id = "commentInput";
        commentInput.name = "comment";
        commentInput.placeholder = "댓글을 남겨주세요!";

        commentInput.addEventListener("input", function () {
            const comment = commentInput.value.trim();

            if (comment === "") {
                commentSubmitButton.disabled = true;
            } else {
                commentSubmitButton.disabled = false;
            }
        });

        const footer = document.createElement("div");
        footer.classList.add("comment-form-footer");

        const commentSubmitButton = document.createElement("button");
        commentSubmitButton.type = "submit";
        commentSubmitButton.classList.add("comment-submit-button");
        commentSubmitButton.id = "commentSubmitButton";
        commentSubmitButton.disabled = true;
        commentSubmitButton.textContent = "댓글 등록";

        footer.appendChild(commentSubmitButton);

        commentForm.appendChild(commentInput);
        commentForm.appendChild(footer);

        commentForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const commentData = {
                comment: commentInput.value.trim()
            };
            console.log(commentData.comment);

            if (commentForm.dataset.mode === "edit") {
                const result = await updateComment(postId, commentForm.dataset.commentId, commentData);
            } else if (commentForm.dataset.mode === "create") {
                const result = await createComment(postId, commentData);
            }
            
            console.log(result);

            window.location.reload();
        });

        const result = await getComments(postId);
        const comments = result.comments;

        const commentList = document.createElement("div");
        commentList.classList.add("comment-list");
        commentList.id = "commentList";

        comments.forEach((comment) => {
            const commentItem = createCommentItem(comment);
            commentList.appendChild(commentItem);
        });

        commentSection.appendChild(commentForm);
        commentSection.appendChild(commentList);

        main.appendChild(article);
        main.appendChild(commentSection);

        function createCommentItem(comment) {
            const article = document.createElement("article");
            article.classList.add("comment-item");
            article.dataset.commentId = comment.commentId;

            const commentHeader = document.createElement("div");
            commentHeader.classList.add("comment-header");

            const authorInfo = document.createElement("div");
            authorInfo.classList.add("author-info");

            const authorProfile = document.createElement("div");
            authorProfile.classList.add("author-profile");

            const authorName = document.createElement("strong");
            authorName.classList.add("author-name");
            authorName.textContent = "더미 작성자 1";

            const postDate = document.createElement("time");
            postDate.classList.add("post-date");
            postDate.textContent = "2021-01-01 00:00:00";

            authorInfo.appendChild(authorProfile);
            authorInfo.appendChild(authorName);
            authorInfo.appendChild(postDate);

            const commentActions = document.createElement("div");
            commentActions.classList.add("comment-actions");

            const commentEditButton = document.createElement("button");
            commentEditButton.type = "button";
            commentEditButton.classList.add("small-button", "comment-edit-button");
            commentEditButton.id = "commentEditButton";
            commentEditButton.textContent = "수정";

            commentEditButton.addEventListener("click", function (event) {
                // 3. 클릭한 버튼과 가장 가까운 .comment-item을 가져옴
                const commentItem = event.target.closest(".comment-item");
                const commentId = commentItem.dataset.commentId;
                const commentContent = commentItem.querySelector(".comment-content");

                // 5. 댓글 입력창에 수정할 댓글의 내용을 올림
                commentInput.value = commentContent.textContent;

                commentForm.dataset.mode = "edit";
                commentForm.dataset.commentId = commentId;

                // 6. 댓글 등록 버튼을 댓글 수정으로 바꾸고 활성화
                commentSubmitButton.textContent = "댓글 수정";
                commentSubmitButton.disabled = "false";
            });

            const commentDeleteButton = document.createElement("button");
            commentDeleteButton.type = "button";
            commentDeleteButton.classList.add("small-button", "comment-delete-button");
            commentDeleteButton.textContent = "삭제";

            commentDeleteButton.addEventListener("click", function () {
                // 3. 삭제 모달창 가져옴
                const deleteCommentModal = document.querySelector("#deleteCommentModal");

                // 4. 삭제 모달창 띄우고 배경 스크롤 불가능
                deleteCommentModal.classList.remove("is-hidden");
                document.body.classList.add("modal-open");

                // 5. 삭제 모달창의 취소, 확인 버튼 가져옴
                const cancelDeleteCommentButton = document.querySelector("#cancelDeleteCommentButton");
                const confirmDeleteCommentButton = document.querySelector("#confirmDeleteCommentButton");

                // 6. 취소 버튼 누르면 모달창 숨기고 배경 스크롤 가능
                cancelDeleteCommentButton.addEventListener("click", () => {
                    deleteCommentModal.classList.add("is-hidden");
                    document.body.classList.remove("modal-open");
                });

                // 6. 삭제 버튼 누르면 댓글 삭제하고 게시글로 돌아감
                confirmDeleteCommentButton.addEventListener("click", async (event) => {
                    // 댓글 삭제
                    const result = await deleteComment(postId, comment.commentId);

                    console.log(result);

                    // 7. 다시 모달창 숨기고 배경 스크롤 가능
                    deleteCommentModal.classList.add("is-hidden");
                    document.body.classList.remove("modal-open");

                    // 8. 해당 페이지 새로고침
                    window.location.reload();
                });
            });

            commentActions.appendChild(commentEditButton);
            commentActions.appendChild(commentDeleteButton);

            commentHeader.appendChild(authorInfo);
            commentHeader.appendChild(commentActions);

            const commentContent = document.createElement("p");
            commentContent.classList.add("comment-content");
            commentContent.textContent = comment.commentContent;

            article.appendChild(commentHeader);
            article.appendChild(commentContent);

            return article;
        }
    } catch (error) {
        alert(error.message);
    }
});
