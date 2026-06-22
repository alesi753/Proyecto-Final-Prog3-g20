import { ars } from '../../utils/format';
import { partName } from '../../hooks/useMarcas';
import styles from './OrderHistory.module.css';

// Order lifecycle, in flow order. Cancelled sits last.
const ESTADOS = ['pendiente', 'pagado', 'preparando', 'enviado', 'entregado', 'cancelado'];
const ESTADO_LABEL = {
  pendiente: 'Pendientes',
  pagado: 'Pagadas',
  preparando: 'En preparación',
  enviado: 'Enviadas',
  entregado: 'Entregadas',
  cancelado: 'Canceladas',
};

// User's orders grouped by estado. Item names resolve from the product cache
// (`byId`) since order items only carry productoId; prices use the historical
// precioAlComprar, not the current catalog price.
export default function OrderHistory({ ordenes, byId, marcas }) {
  const grupos = ESTADOS
    .map(estado => ({ estado, lista: ordenes.filter(o => o.estado === estado) }))
    .filter(g => g.lista.length > 0);

  return (
    <section className={styles.history}>
      <h2 className={styles.heading}>Tus órdenes</h2>

      {grupos.map(({ estado, lista }) => (
        <div key={estado} className={styles.group}>
          <div className={styles.groupHead}>
            <span className={`${styles.badge} ${styles[estado]}`}>{ESTADO_LABEL[estado]}</span>
            <span className={styles.count}>{lista.length}</span>
          </div>

          {lista.map(orden => (
            <article key={orden.id} className={styles.order}>
              <div className={styles.orderHead}>
                <span className={styles.orderId}>Orden #{orden.id}</span>
                <span className={styles.orderDate}>
                  {new Date(orden.fechaCreacion).toLocaleDateString('es-AR')}
                </span>
                <span className={styles.orderTotal}>{ars(orden.precioTotal)}</span>
              </div>

              <div className={styles.items}>
                {(orden.items ?? []).map(item => {
                  const product = byId.get(item.productoId);
                  const name = product ? partName(product, marcas) : `Producto #${item.productoId}`;
                  return (
                    <div key={item.id} className={styles.item}>
                      <span className={styles.itemName}>x{item.cantidad} {name}</span>
                      <span className={styles.itemPrice}>
                        {ars(Number(item.precioAlComprar) * item.cantidad)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      ))}
    </section>
  );
}
