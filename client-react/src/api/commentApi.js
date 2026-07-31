import { request } from "./http.js";

// 댓글 등록
export function createComment(postId, commentData) {
    return request(`/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify(commentData)
    });
}

// 댓글 목록 조회
export function getComments(postId) {
    return request(`/posts/${postId}/comments`, {
        method: "GET"
    });
}

// 댓글 수정
export function updateComment(postId, commentId, commentData) {
    return request(`/posts/${postId}/comments/${commentId}`, {
        method: "PATCH",
        body: JSON.stringify(commentData)
    });
}

// 댓글 삭제
export function deleteComment(postId, commentId) {
    return request(`/posts/${postId}/comments/${commentId}`, {
        method: "DELETE"
    });
}

