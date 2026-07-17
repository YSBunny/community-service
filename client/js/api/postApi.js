import { request } from "./http.js";

// 게시글 작성
export function createPost(postData) {
    return request("/posts", {
        method: "POST",
        body: postData
    });
}

// 게시글 목록
export function getPosts() {
    return request("/posts", {
        method: "GET"
    });
}

// 게시글 상세
export function getPost(postId) {
    return request(`/posts/${postId}`, {
        method: "GET"
    });
}

// 게시글 수정
export function updatePost(postId, postData) {
    return request(`/posts/${postId}`, {
        method: "PATCH",
        body: postData
    });
}

// 게시글 삭제
export function deletePost(postId) {
    return request(`/posts/${postId}`, {
        method: "DELETE"
    });
}
