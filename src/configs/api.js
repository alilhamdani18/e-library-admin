// src/services/api.js
import axios from 'axios';

// Base URL dari Cloud Run Anda
const BASE_URL = 'https://e-library-backend-72451776465.asia-southeast2.run.app'; // Ganti dengan URL Cloud Run Anda

// Membuat instance axios dengan konfigurasi default
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menambahkan token jika diperlukan
api.interceptors.request.use(
  (config) => {
    // Jika Anda menggunakan authentication token
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk handle response errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      // Redirect to login if needed
    }
    return Promise.reject(error);
  }
);

export default api;