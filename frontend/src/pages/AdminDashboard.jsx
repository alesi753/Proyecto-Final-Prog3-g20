import { useState, Fragment } from 'react';
import { useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { actualizarEstadoOrden } from '../services/ordenes.service';
import { useOrdenesAdmin } from '../hooks/useOrdenesAdmin';
import { ars } from '../utils/format';
import styles from './AdminDashboard.module.css';

const ESTADOS = ['pendiente', 'pagado', 'preparando', 'enviado', 'entregado', 'cancelado'];
const capitalizar = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const { data: ordenes = [], isLoading, isError, error } = useOrdenesAdmin();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // estado elegido pero no aplicado, por orden
  const [seleccion, setSeleccion] = useState({});
  // orden con el detalle desplegado
  const [expandidaId, setExpandidaId] = useState(null);

  function toggleDetalle(ordenId) {
    setExpandidaId((actual) => (actual === ordenId ? null : ordenId));
  }

  async function handleAplicar(ordenId) {
    const nuevoEstado = seleccion[ordenId];
    if (!nuevoEstado) return;

    setIsSubmitting(true);
    try {
      await actualizarEstadoOrden(ordenId, nuevoEstado);

      toast.success(`Pedido #${ordenId} actualizado a ${nuevoEstado}`);

      // limpia lo pendiente e invalida para resincronizar con el backend
      setSeleccion((actual) => {
        const copia = { ...actual };
        delete copia[ordenId];
        return copia;
      });
      await queryClient.invalidateQueries('ordenes-admin');
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

      {isLoading ? (
        <p>Cargando pedidos…</p>
      ) : isError ? (
        <p>{error?.message || 'No se pudieron cargar los pedidos.'}</p>
      ) : ordenes.length === 0 ? (
        <p>No hay pedidos registrados.</p>
      ) : (
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
              {ordenes.map((orden) => {
                const estadoElegido = seleccion[orden.id] ?? orden.estado;
                const sinCambios = estadoElegido === orden.estado;
                const abierta = expandidaId === orden.id;
                const cliente = orden.UsuarioModel;

                return (
                  <Fragment key={orden.id}>
                    <tr
                      className={styles.row}
                      onClick={() => toggleDetalle(orden.id)}
                      aria-expanded={abierta}
                    >
                      <td>
                        <span className={styles.caret}>{abierta ? '▾' : '▸'}</span>
                        #{orden.id}
                      </td>
                      <td>{orden.usuarioId}</td>
                      <td>${orden.precioTotal}</td>
                      <td className={styles.statusBold}>
                        {orden.estado.toUpperCase()}
                      </td>
                      {/* no togglear el detalle al usar el selector/botón */}
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className={styles.actionCell}>
                          <select
                            className={styles.select}
                            value={estadoElegido}
                            disabled={isSubmitting}
                            onChange={(e) =>
                              setSeleccion((s) => ({ ...s, [orden.id]: e.target.value }))
                            }
                          >
                            {ESTADOS.map((estado) => (
                              <option key={estado} value={estado}>
                                {capitalizar(estado)}
                              </option>
                            ))}
                          </select>
                          <button
                            className={styles.applyBtn}
                            disabled={isSubmitting || sinCambios}
                            onClick={() => handleAplicar(orden.id)}
                          >
                            Aplicar
                          </button>
                        </div>
                      </td>
                    </tr>

                    {abierta && (
                      <tr className={styles.detailRow}>
                        <td colSpan={5}>
                          <div className={styles.detail}>
                            <div>
                              <h3 className={styles.detailTitle}>Cliente</h3>
                              {cliente ? (
                                <p className={styles.detailClient}>
                                  {cliente.nombre} {cliente.apellido}
                                  <span className={styles.detailMuted}> · {cliente.correo}</span>
                                </p>
                              ) : (
                                <p className={styles.detailClient}>Usuario #{orden.usuarioId}</p>
                              )}
                              <p className={styles.detailMuted}>
                                Fecha: {new Date(orden.fechaCreacion).toLocaleDateString('es-AR')}
                              </p>
                            </div>

                            <div>
                              <h3 className={styles.detailTitle}>Productos</h3>
                              {(orden.items ?? []).length > 0 ? (
                                <ul className={styles.itemList}>
                                  {orden.items.map((item) => {
                                    const producto = item.ProductoModel;
                                    const nombre = producto?.modelo ?? `Producto #${item.productoId}`;
                                    return (
                                      <li key={item.id} className={styles.item}>
                                        <span>x{item.cantidad} {nombre}</span>
                                        <span>{ars(Number(item.precioAlComprar) * item.cantidad)}</span>
                                      </li>
                                    );
                                  })}
                                </ul>
                              ) : (
                                <p className={styles.detailMuted}>Sin productos en esta orden.</p>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
