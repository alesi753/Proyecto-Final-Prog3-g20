import { ars } from '../../utils/format';
import { useMarcas, partName } from '../../hooks/useMarcas';
import styles from './BuildSidebar.module.css';

const SLOTS = [
  { key: 'cpu',     abbr: 'CPU', cat: 'Procesador' },
  { key: 'mb',      abbr: 'MB',  cat: 'Motherboard' },
  { key: 'ram',     abbr: 'RAM', cat: 'Memoria RAM' },
  { key: 'storage', abbr: 'SSD', cat: 'Almacenamiento' },
  { key: 'gpu',     abbr: 'GPU', cat: 'Placa de Video' },
  { key: 'psu',     abbr: 'PSU', cat: 'Fuente de Poder' },
  { key: 'case',    abbr: 'BOX', cat: 'Gabinete' },
];

// A slot value is a product, an array of products (RAM/storage), or null.
const isFilled = v => (Array.isArray(v) ? v.length > 0 : !!v);
const slotPrice = v =>
  Array.isArray(v)
    ? v.reduce((s, p) => s + Number(p.precio), 0)
    : (v ? Number(v.precio) : 0);

export default function BuildSidebar({ selectedParts, currentStep, onNavigate }) {
  const { data: marcas } = useMarcas();
  const total = Object.values(selectedParts).reduce((sum, v) => sum + slotPrice(v), 0);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h2 className={styles.title}>Tu build</h2>
        <span className={styles.stepCount}>Paso {currentStep + 1} / 7</span>
      </div>

      <div className={styles.slotList}>
        {SLOTS.map(({ key, abbr, cat }, index) => {
          const value = selectedParts[key];
          const filled = isFilled(value);
          const isList = Array.isArray(value);
          // Jumpable only when every earlier slot is filled — mirrors the
          // wizard's "can't advance until you pick" rule.
          const reachable = index === 0 || SLOTS.slice(0, index).every(s => isFilled(selectedParts[s.key]));
          const isCurrent = index === currentStep;

          let model = 'Pendiente';
          if (filled) {
            model = isList
              ? (value.length === 1 ? partName(value[0], marcas) : `${value.length} unidades`)
              : partName(value, marcas);
          }

          return (
            <button
              key={key}
              type="button"
              disabled={!reachable}
              onClick={() => onNavigate?.(index)}
              className={`${styles.slot} ${isCurrent ? styles.slotCurrent : ''}`}
            >
              <span className={`${styles.abbr} ${filled ? styles.abbrFilled : styles.abbrEmpty}`}>
                {abbr}
              </span>
              <div className={styles.slotInfo}>
                <span className={styles.slotCat}>{cat}</span>
                <span className={`${styles.slotModel} ${filled ? styles.slotModelFilled : styles.slotModelEmpty}`}>
                  {model}
                </span>
              </div>
              <span className={`${styles.slotPrice} ${filled ? styles.slotPriceFilled : styles.slotPriceEmpty}`}>
                {filled ? ars(slotPrice(value)) : '—'}
              </span>
            </button>
          );
        })}
      </div>

      <div className={styles.total}>
        <span className={styles.totalLabel}>Total</span>
        <span className={styles.totalValue}>{ars(total)}</span>
      </div>
    </aside>
  );
}
