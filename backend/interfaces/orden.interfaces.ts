
// Extraemos el ENUM a un tipo para poder reutilizarlo
export type EstadoOrden = 'pendiente' | 'pagado' | 'enviado' | 'cancelado';

export interface InterfaceOrden {
  id: number;
  usuarioId: number;
  precioTotal: number;
  estado: EstadoOrden;
  fechaCreacion: Date; 
}