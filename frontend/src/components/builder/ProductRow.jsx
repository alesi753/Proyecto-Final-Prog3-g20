import { ars } from '../../utils/format';
import styles from './ProductRow.module.css';

// Clickable product row in a builder step's list. Presentational only —
// the parent owns selection/viewing state and passes flags down.
export default function ProductRow({ product, name, isSelected, count = 0, onClick }) {
  // Build membership is meaningful; the ver/viendo toggle isn't, so it's a single legend.
  const badgeClass = isSelected ? styles.badgeSelected : styles.badgeDefault;
  const badgeLabel = isSelected
    ? (count > 1 ? `✓ x${count} en la build` : '✓ En la build')
    : '🛈';

  return (
    <button className={styles.rowBtn} onClick={onClick}>
      <div className={styles.rowInfo}>
        <span className={styles.rowName}>{name ?? product.modelo}</span>
        <span className={styles.rowMeta}>
          {product.stock > 0 ? `${product.stock} en stock` : 'Sin stock'}
        </span>
      </div>
      <div className={styles.rowRight}>
        <span className={styles.rowPrice}>{ars(product.precio)}</span>
        <span className={`${styles.badge} ${badgeClass}`}>{badgeLabel}</span>
      </div>
    </button>
  );
}
