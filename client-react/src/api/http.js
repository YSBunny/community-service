const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function request(url, options = {}) {
  const accessToken = localStorage.getItem("accessToken");

  const isFormData = options.body instanceof FormData;

  const headers = {
    ...options.headers
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers
  });

  const isLoginRequest = url.includes("/api/auth/login");

  if (response.status === 204) {
    return null;
  }
  // 토큰에 문제가 있을 때(로그인, 회원가입 요청이 아닌데 401을 반환받았을 때)
  else if (response.status === 401 && !isLoginRequest) {
    localStorage.removeItem("userId");
    localStorage.removeItem("accessToken");
    window.location.replace("/login");
  }

  if (!response.ok) {
    const errorText = await response.text();

    console.error("API 요청 실패");
    console.error("요청 URL:", `${BASE_URL}${url}`);
    console.error("상태 코드:", response.status);
    console.error("응답 내용:", errorText);

    throw new Error(errorText || "API 요청에 실패했습니다.");
  }

  return await response.json();
}
