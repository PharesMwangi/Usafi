import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

const api = axios.create({
    baseURL: `${API_URL}/api`,
    // withCredentials: true, //sends http only jwt cookie with every request
});

// Attach the stored token to every outgoing request, if we have one.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("usafi_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
export { API_URL };