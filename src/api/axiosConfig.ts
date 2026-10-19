import axios from "axios";



const apiClient = axios.create({
  baseURL: "https://coffee-warehouse-backend-production-2a08.up.railway.app/api",
  headers: {
    Accept: "application/json",
  },
});

// coffee-warehouse-backend.railway.internal ini diambil dari railway perbaiki base url

apiClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;