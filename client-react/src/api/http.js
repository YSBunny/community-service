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

  // 인증이 필요한 요청에서 401이 발생하면 로그인 상태를 정리
  if (response.status === 401 && auth) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    window.location.replace("/login");

    // 리다이렉트가 완료되기 전에 아래 응답 처리가 계속되지 않도록 종료
    throw new Error("로그인이 만료되었습니다. 다시 로그인해주세요.");
  }

  // JSON, 문자열, 본문 없는 응답, 204 응답을 모두 처리
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
