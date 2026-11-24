import axios from "axios";
import { env } from "@/config/env";

// localStorage key where the bearer token is stored
export const TOKEN_KEY = "token";

// Shared Axios instance: every API call goes through it
export const apiClient = axios.create({
  baseURL: env.API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Before each request: attach the token if the user is logged in
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// After each response: return only the data, and handle expired sessions
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 401 = token missing or expired, so clear it and go to login
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
