import { useQuery } from 'react-query';
import { obtenerTodasLasOrdenes } from '../services/ordenes.service';

// Todas las órdenes para el panel admin. staleTime 0: refetch al invalidar.
export function useOrdenesAdmin() {
  return useQuery('ordenes-admin', obtenerTodasLasOrdenes, { staleTime: 0 });
}
