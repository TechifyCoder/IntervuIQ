import axios from "axios";

const API = axios.create({
  // Ye automatically production mein Render ka URL lega, local mein localhost
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:4000",
  
  // Agar cookies/auth use kar raha hai to ye jaruri hai
  withCredentials: true,
});

export default API;