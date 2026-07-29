import { request } from "./http.js";

// 게시글 목록
export function getPosts() {
    return request("/posts", {
        method: "GET"
    });
}
