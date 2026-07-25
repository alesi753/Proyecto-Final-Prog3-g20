import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductos } from '../hooks/useProductos';
import styles from './Home.module.css';
import officeSetup from '../assets/images/office-setup.jpg';
import midSetup from '../assets/images/mid-setup.jpg';
import highEndSetup from '../assets/images/high-end-setup.jpg';

const ars = n =>
  Number(n).toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    currencyDisplay: 'code',
    maximumFractionDigits: 0,
  });

const SLOT_KEYS = ['cpu', 'mb', 'ram', 'storage', 'gpu', 'psu', 'case'];

// Precio de la card = suma de sus partes; ram/storage pueden traer varios IDs por coma.
function buildPrice(buildUrl, byId) {
  const params = new URLSearchParams(buildUrl.split('?')[1] ?? '');
  let total = 0;
  SLOT_KEYS.forEach(key => {
    (params.get(key) ?? '').split(',').filter(Boolean).forEach(idStr => {
      const p = byId.get(Number(idStr));
      if (p) total += Number(p.precio);
    });
  });
  return total;
}

const CONFIGS = [
  {
    tag: 'Económica',
    name: 'Oficina',
    specs: ['Procesador · Entrada', '16 GB RAM DDR5', 'SSD 1 TB NVMe', 'Gráficos integrados'],
    image: officeSetup,
    // Ryzen 5 7600 (iGPU), B650 DDR5, 16GB, 1TB NVMe, 500W, Mid-Tower. Sin GPU.
    buildUrl: '/builder?cpu=1&mb=6&ram=13&storage=15&psu=18&case=19&step=6',
  },
  {
    tag: 'Balanceada',
    name: 'Gamer de entrada',
    specs: ['Procesador · Media', '16 GB RAM DDR5', 'SSD 1 TB NVMe', 'Placa de video gama media'],
    image: midSetup,
    // i5-12400F, B760 DDR5, 16GB, 1TB NVMe, RTX 4060, RM750, Mid-Tower.
    buildUrl: '/builder?cpu=4&mb=8&ram=13&storage=15&gpu=10&psu=17&case=19&step=6',
  },
  {
    tag: 'Tope de gama',
    name: 'High-end',
    specs: ['Procesador · Tope', '32 GB RAM DDR5', 'SSD 2 TB NVMe', 'Placa de video tope'],
    image: highEndSetup,
    // i7-13700K, B760 DDR5, 2x16GB, 2x1TB NVMe, RTX 4070, RM750, Mid-Tower.
    buildUrl: '/builder?cpu=5&mb=8&ram=13,13&storage=15,15&gpu=11&psu=17&case=19&step=6',
  },
];

function ConfigCard({ tag, name, price, specs, image, onCustomize }) {
  return (
    <div className={styles.card}>
      <div className={`${styles.cardImage} ${image ? styles.cardImagePhoto : ''}`}>
        {image ? (
          <img src={image} alt={name} className={styles.cardImg} />
        ) : (
          <span className={styles.cardImageLabel}>foto build</span>
        )}
      </div>

      <div className={styles.cardBody}>
        <div>
          <span className={styles.cardTag}>{tag}</span>
          <p className={styles.cardName}>{name}</p>
        </div>

        <ul className={styles.specList}>
          {specs.map(spec => (
            <li key={spec} className={styles.specItem}>
              <span className={styles.specDot} />
              <span className={styles.specText}>{spec}</span>
            </li>
          ))}
        </ul>

        <div className={styles.cardFooter}>
          <div>
            <span className={styles.priceLabel}>Monto</span>
            <span className={styles.priceValue}>{price ? ars(price) : '—'}</span>
          </div>
          <button className={styles.customizeBtn} onClick={onCustomize}>
            Personalizar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { data: productos } = useProductos();

  const byId = useMemo(() => {
    const map = new Map();
    (productos ?? []).forEach(p => map.set(p.id, p));
    return map;
  }, [productos]);

  return (
    <main className={styles.main}>
      {/* Hero */}
      <p className={styles.eyebrow}>Armá tu PC · sin vueltas</p>
      <h1 className={styles.heroTitle}>Construí la PC que necesitás, pieza por pieza.</h1>
      <p className={styles.heroSubtitle}>
        Elegí una de nuestras bases populares y ajustala, o empezá desde cero con el armado guiado paso a paso.
      </p>

      {/* Popular configs */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Configuraciones populares</h2>
        <span className={styles.sectionCount}>seleccioná tu preferencia!</span>
      </div>

      <div className={styles.grid}>
        {CONFIGS.map(cfg => (
          <ConfigCard
            key={cfg.name}
            {...cfg}
            price={buildPrice(cfg.buildUrl, byId)}
            onCustomize={() => navigate(cfg.buildUrl)}
          />
        ))}
      </div>

      {/* CTA */}
      <div className={styles.cta}>
        <div>
          <p className={styles.ctaTitle}>¿Querés algo totalmente a medida?</p>
          <p className={styles.ctaSubtitle}>
            Te guiamos por cada componente —procesador, motherboard, RAM y más— con toda la info que necesitás siempre a mano.
          </p>
        </div>
        <button className={styles.ctaBtn} onClick={() => navigate('/builder')}>
          Armá tu PC personalizada →
        </button>
      </div>
    </main>
  );
}
