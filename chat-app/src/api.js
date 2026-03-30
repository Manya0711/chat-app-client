import axios from 'axios';

const API = axios.create({
  // Change this from http://localhost:5000/api to your Render URL
  baseURL: 'https://chat-app-backend-e7xd.onrender.com/api',
});

// This helps keep your token attached to every request automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;