import { useState } from 'react';
import toast from 'react-hot-toast';
import { actualizarEstadoOrden } from '../services/ordenes.service';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  // Mock temporal hasta que conectemos el GET de todas las órdenes
  const [ordenes, setOrdenes] = useState([
    { id: 1, usuarioId: 2, precioTotal: '15000.00', estado: 'pendiente' },
    { id: 2, usuarioId: 5, precioTotal: '8500.50', estado: 'pagado' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCambiarEstado(ordenId, nuevoEstado) {
    setIsSubmitting(true);

    try {
      
      await actualizarEstadoOrden(ordenId, nuevoEstado);
      
      toast.success(`Pedido #${ordenId} actualizado a ${nuevoEstado}`);
      
      setOrdenes(ordenes.map(orden => 
        orden.id === ordenId ? { ...orden, estado: nuevoEstado } : orden
      ));
    } catch (err) {
      toast.error(err.message || 'No se pudo actualizar el estado.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <p className={styles.eyebrow}>Panel de Control</p>
      <h1 className={styles.title}>Gestión de Pedidos</h1>
      
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>ID Usuario</th>
              <th>Total</th>
              <th>Estado Actual</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((orden) => (
              <tr key={orden.id}>
                <td>#{orden.id}</td>
                <td>{orden.usuarioId}</td>
                <td>${orden.precioTotal}</td>
                <td className={styles.statusBold}>
                  {orden.estado.toUpperCase()}
                </td>
                <td>
                  <select 
                    className={styles.select}
                    defaultValue={orden.estado}
                    disabled={isSubmitting}
                    onChange={(e) => handleCambiarEstado(orden.id, e.target.value)}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="pagado">Pagado</option>
                    <option value="preparando">Preparando</option>
                    <option value="enviado">Enviado</option>
                    <option value="entregado">Entregado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

  