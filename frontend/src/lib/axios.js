// src/lib/axios.js   (or wherever you have it)
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development"
    ? 'http://localhost:4000/api'          // development
    : import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api` : '/api', // production
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default axiosInstance