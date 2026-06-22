import { useQuery } from 'react-query';
import axios from 'axios';

const base = process.env.REACT_APP_API_URL ?? '/api';

const fetchMarcas = () =>
  axios.get(`${base}/marcas`).then(r => r.data);

export function useMarcas() {
  return useQuery('marcas', fetchMarcas, { staleTime: Infinity });
}

// Resolves a marcaId to its brand name. Products only carry marcaId, so the
// builder uses this to label/group them by manufacturer.
export function marcaName(marcas, id) {
  if (!marcas) return null;
  return marcas.find(m => m.id === id)?.nombre ?? null;
}

// Display label for a product: "{brand} {model}", falling back to just the model
// until the brand list has loaded.
export function partName(product, marcas) {
  if (!product) return '';
  const brand = marcaName(marcas, product.marcaId);
  return brand ? `${brand} ${product.modelo}` : product.modelo;
}
