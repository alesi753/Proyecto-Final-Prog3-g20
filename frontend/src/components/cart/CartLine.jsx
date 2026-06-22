import { ars } from '../../utils/format';
import styles from './CartLine.module.css';

// One cart row: "x{qty} - {brand} {model}    {price×qty}   [−] [+]".
// The + is capped at the product's available stock.
export default function CartLine({ name, qty, unitPrice, stock, onAddOne, onRemoveOne }) {
  const atStock = qty >= stock;
  return (
    <div className={styles.line}>
      <span className={styles.qty}>x{qty}</span>
      <span className={styles.name}>{name}</span>
      <span className={styles.price}>{ars(unitPrice * qty)}</span>
      <div className={styles.actions}>
        <button
          className={styles.btn}
          onClick={onRemoveOne}
          disabled={qty <= 0}
          aria-label="Quitar uno"
        >
          −
        </button>
        <button
          className={styles.btn}
          onClick={onAddOne}
          disabled={atStock}
          title={atStock ? `Sin más stock (máx ${stock})` : 'Agregar uno'}
          aria-label="Agregar uno"
        >
          +
        </button>
      </div>
    </div>
  );
}
