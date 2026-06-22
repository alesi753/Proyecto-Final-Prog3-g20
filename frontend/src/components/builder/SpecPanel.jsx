import styles from './SpecPanel.module.css';

// Expanded spec view for a product. Renders the configured specFields, skipping
// any key the product's especificaciones doesn't have. Owns the action button.
// In `multi` mode the button adds another unit (until `full`); otherwise it's a
// single-choice toggle gated by `isSelected`.
export default function SpecPanel({ product, specFields, isSelected, onChoose, multi, full }) {
  const specs = product.especificaciones || {};

  const disabled = multi ? full : isSelected;
  const label = multi
    ? (full ? 'Sin slots libres' : 'Agregar →')
    : (isSelected ? '✓ Cargado al build' : 'Elegir →');

  return (
    <div className={styles.specPanel}>
      <div className={styles.specHeader}>
        <h3 className={styles.specSubtitle}>Especificaciones</h3>
        <button
          className={`${styles.chooseBtn} ${disabled ? styles.chooseBtnDone : styles.chooseBtnActive}`}
          onClick={() => !disabled && onChoose(product)}
          disabled={disabled}
        >
          {label}
        </button>
      </div>

      <div className={styles.specGrid}>
        {specFields.map(({ label, key, unit = '' }) => (
          specs[key] !== undefined && (
            <div key={key} className={styles.specField}>
              <span className={styles.specLabel}>{label}</span>
              <span className={styles.specValue}>{specs[key]}{unit}</span>
            </div>
          )
        ))}
      </div>
    </div>
  );
}
