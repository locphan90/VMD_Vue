import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:7210',
  withCredentials: true, // ✅ Cho phép gửi cookie nếu cần
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*',
  }
});

export default instance;
