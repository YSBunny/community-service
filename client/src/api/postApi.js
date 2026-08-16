import { request } from "./http.js";

function makePostFormData({ title, content, postImage }) {
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
  return request("/posts", {
    method: "POST",
    body: makePostFormData(postData)
  });
}

// 게시글 목록 조회
export function getPosts() {
  return request("/posts", { method: "GET" });
}

// 게시글 상세 조회
export function getPost(postId) {
  return request(`/posts/${postId}`, { method: "GET" });
}

// 게시글 반응 추가
export function setPostReaction(postId, type) {
  return request(`/posts/${postId}/reaction`, {
    method: "PUT",
    body: JSON.stringify({ type })
  });
}

// 게시글 반응 삭제
export function deletePostReaction(postId) {
  return request(`/posts/${postId}/reaction`, {
    method: "DELETE"
  });
}

// 게시글 수정
export function updatePost(postId, postData) {
  return request(`/posts/${postId}`, {
    method: "PATCH",
    body: makePostFormData(postData)
  });
}

// 게시글 삭제
export function deletePost(postId) {
  return request(`/posts/${postId}`, {
    method: "DELETE"
  });
}
