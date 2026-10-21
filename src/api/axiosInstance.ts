import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { API_BASE } from '../config/authConfig';

const axiosInstance = axios.create({
  // Base vacía = mismo origen (proxy de Vite en local, CloudFront en AWS).
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const oidcStorageKey = Object.keys(sessionStorage).find((key) =>
      key.startsWith('oidc.user:')
    );

    if (oidcStorageKey) {
      const oidcRawData = sessionStorage.getItem(oidcStorageKey);
      if (oidcRawData) {
        const user = JSON.parse(oidcRawData);
        if (user?.id_token) {
          config.headers.set('Authorization', `Bearer ${user.id_token}`);
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
