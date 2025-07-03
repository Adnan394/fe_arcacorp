import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export const fetchGet = async (url) => {
  const response = await api.get(url);
  return response.data;
};

export const fetchPost = async (url, data) => {
  const response = await api.post(url, data);
  return response.data;
};

export const fetchPut = async (url, data) => {
  const response = await api.put(url, data);
  return response.data;
};

