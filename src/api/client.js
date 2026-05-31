import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:8080/v1/admin',
  timeout: 10000,
});

// Response interceptor — log errors in dev
client.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('[NAZER API]', err.config?.url, err.response?.status, err.message);
    return Promise.reject(err);
  }
);

export default client;
