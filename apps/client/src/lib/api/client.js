import { API_BASE_URL } from "./config";
import { getAccessToken } from "../auth/tokenStorage";

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiFetch(path, options = {}) {
  const { headers: customHeaders = {}, body, ...rest } = options;
  const headers = {
    ...customHeaders,
  };

  if (body !== undefined && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const accessToken = getAccessToken();
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  console.log("API Request:", path, "Method:", rest.method || "GET", "Body type:", body instanceof FormData ? "FormData" : typeof body);
  
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers,
    body:
      body !== undefined && !(body instanceof FormData) && typeof body !== "string"
        ? JSON.stringify(body)
        : body,
  });

  console.log("API Response status:", response.status, "ok:", response.ok);

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : null;

  console.log("API Response payload:", payload);

  if (!response.ok) {
    const message =
      (typeof payload?.detail === "string" && payload.detail) ||
      (Array.isArray(payload?.detail) && payload.detail[0]?.msg) ||
      response.statusText ||
      "Request failed";
    console.error("API Error:", message, "Status:", response.status);
    throw new ApiError(response.status, message);
  }

  return payload;
}
