const BASE_URL = "http://localhost:8080/api";

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

  if (!response.ok) {
    const errorText = await response.text();

    console.error("API 요청 실패");
    console.error("요청 URL:", `${BASE_URL}${url}`);
    console.error("상태 코드:", response.status);
    console.error("응답 내용:", errorText);

    throw new Error(errorText || "API 요청에 실패했습니다.");
  }

  if (response.status === 204) {
    return null;
  }

  return await response.json();
}
