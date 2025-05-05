import axios from "axios";
import { SERVER_DOMAIN } from "./env";

const token = localStorage.getItem("token");

export const axiosServerInstance = axios.create({
    baseURL: `${SERVER_DOMAIN}`,
  });
  
  // Add request interceptor to dynamically set token
  axiosServerInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });