import { useQuery } from 'react-query';
import axios from 'axios';

const base = process.env.REACT_APP_API_URL ?? '/api';

const fetchCategorias = () =>
  axios.get(`${base}/categorias`).then(r => r.data);

export function useCategorias() {
  return useQuery('categorias', fetchCategorias, { staleTime: Infinity });
}

// Returns all category IDs that are descendants of a given category name.
// Walks the flat list returned by the API as a tree.
export function getDescendantIds(categorias, ancestorName) {
  if (!categorias) return [];

  const ancestor = categorias.find(c => c.nombre === ancestorName);
  if (!ancestor) return [];

  const ids = new Set();
  const queue = [ancestor.id];

  while (queue.length) {
    const current = queue.shift();
    ids.add(current);
    categorias
      .filter(c => c.padreId === current)
      .forEach(c => queue.push(c.id));
  }

  return [...ids];
}
