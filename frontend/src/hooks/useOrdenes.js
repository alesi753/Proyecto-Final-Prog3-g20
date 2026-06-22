import { useQuery } from 'react-query';
import { api } from '../api/client';

// The authenticated user's order history (with items). Only runs when logged in.
// Refetches on mount so a fresh purchase shows up after returning to the cart.
export function useOrdenes(enabled) {
  return useQuery(
    'ordenes',
    () => api.get('/ordenes/historial').then(r => r.data.ordenes ?? []),
    { enabled: !!enabled, staleTime: 0 }
  );
}
