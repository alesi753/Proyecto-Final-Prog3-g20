import { useQuery } from 'react-query';
import axios from 'axios';

const base = process.env.REACT_APP_API_URL ?? '/api';

const fetchProductos = () =>
  axios.get(`${base}/productos`).then(r => r.data);

export function useProductos() {
  return useQuery('productos', fetchProductos, { staleTime: 5 * 60 * 1000 });
}
