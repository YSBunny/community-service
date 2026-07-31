const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

export async function request(path, options = {}) {
  const { auth = true, body, headers = {}, ...fetchOptions } = options;
  const accessToken = localStorage.getItem("accessToken");
  const isFormData = body instanceof FormData;

  const requestHeaders = { ...headers };

  // auth: false이면 JWT를 넣지 않음
  if (auth && accessToken) {
    requestHeaders.Authorization = `Bearer ${accessToken}`;
  }

  // body가 있는 JSON 요청에만 Content-Type을 설정
  if (body && !isFormData) {
    requestHeaders["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers: requestHeaders,
    body
  });

  // 토큰이 유효하지 않으면 로그인 정보를 지우고 로그인 페이지로 이동
  if (response.status === 401 && auth) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    window.location.replace("/login");
  }

  // 모든 응답(JSON, 문자열, 본문 없는, 204 No Content)을 읽을 수 있도록 문자열로 읽어들임
  const responseText = await response.text();
  let data = null;

  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      data = responseText;
    }
  }

  if (!response.ok) {
    const message = data?.message || data?.error || data || "요청에 실패했습니다.";
    throw new Error(message);
  }

  return data;
}
