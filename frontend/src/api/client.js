import axios from 'axios';

// Shared axios instance for authenticated calls (auth, cart, orders). Public GETs
// in the hooks keep using bare axios. The interceptor reads the JWT from
// localStorage on every request, so it survives reloads without context wiring.
const baseURL = process.env.REACT_APP_API_URL ?? '/api';

export const api = axios.create({ baseURL });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
