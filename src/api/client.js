import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // HttpOnly 쿠키 자동 포함
});

client.interceptors.response.use(
  (res) => {
    if (res.data?.isSuccess === false) return Promise.reject(res.data);
    return res.data?.result;
  },
  (err) => Promise.reject(err.response?.data ?? err)
);

export default client;