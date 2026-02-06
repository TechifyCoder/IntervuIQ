// src/lib/axios.js   (or wherever you have it)
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.DEV 
    ? 'http://localhost:4000/api'          // development
    : '/api',                              // production (relative → works with Vite proxy or same-domain)
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default axiosInstance