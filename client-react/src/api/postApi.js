import { request } from "./http.js";

function createPostFormData({
    title,
    content,
    postImage
}) {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("content", content);

    if (postImage) {
        formData.append("postImage", postImage);
    }

    return formData;
}

// 게시글 작성
export function createPost(postData) {
    const formData = createPostFormData(postData);

    return request("/posts", {
        method: "POST",
        body: formData
    });
}

// 게시글 목록 조회
export function getPosts() {
    return request("/posts", {
        method: "GET"
    });
}

// 게시글 상세 조회
export function getPost(postId) {
    return request(`/posts/${postId}`, {
        method: "GET"
    });
}

// 게시글 수정
export function updatePost(postId, postData) {
    const formData = createPostFormData(postData);

    return request(`/posts/${postId}`, {
        method: "PATCH",
        body: formData
    });
}

// 게시글 삭제
export function deletePost(postId) {
    return request(`/posts/${postId}`, {
        method: "DELETE"
    });
}
