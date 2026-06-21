// 'estado' goes through a closed cycle: pendiente → pagado → preparando → enviado → entregado
//                                                                                 ↘ cancelado
export type EstadoOrden =
  | 'pendiente'
  | 'pagado'
  | 'preparando'
  | 'enviado'
  | 'entregado'
  | 'cancelado';

export interface InterfaceOrden {
  id: number;
  usuarioId: number;
  precioTotal: number;
  estado: EstadoOrden;
  fechaCreacion: Date;
}
