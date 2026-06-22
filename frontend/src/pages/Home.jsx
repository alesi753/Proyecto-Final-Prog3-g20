import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import officeSetup from '../assets/images/office-setup.jpg';
import midSetup from '../assets/images/mid-setup.jpg';
import highEndSetup from '../assets/images/high-end-setup.jpg';

const ars = n => '$' + Number(n).toLocaleString('es-AR');

const CONFIGS = [
  {
    tag: 'Económica',
    name: 'Oficina',
    price: 650000,
    specs: ['Procesador · Entrada', '16 GB RAM DDR5', 'SSD 512 GB NVMe', 'Gráficos integrados'],
    image: officeSetup,
  },
  {
    tag: 'Balanceada',
    name: 'Gamer de entrada',
    price: 1450000,
    specs: ['Procesador · Media', '16 GB RAM DDR5', 'SSD 1 TB NVMe', 'Placa de video gama media'],
    image: midSetup,
  },
  {
    tag: 'Tope de gama',
    name: 'High-end',
    price: 3900000,
    specs: ['Procesador · Tope', '32 GB RAM DDR5', 'SSD 2 TB NVMe', 'Placa de video tope'],
    image: highEndSetup,
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
            <span className={styles.priceValue}>{ars(price)}</span>
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
            onCustomize={() => navigate('/builder')}
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
