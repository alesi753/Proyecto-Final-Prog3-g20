import { api } from '../api/client';

export const actualizarEstadoOrden = async (ordenId, nuevoEstado) => {
  try {
    const { data } = await api.put(`/ordenes/admin/${ordenId}/estado`, { 
      estado: nuevoEstado 
    });
    
    return data;
  } catch (error) {
    console.error('Error en el servicio de órdenes:', error);
    throw new Error(error.response?.data?.message || 'Error al actualizar el estado');
  }
};