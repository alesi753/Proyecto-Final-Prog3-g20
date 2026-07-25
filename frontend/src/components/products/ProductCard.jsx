import { useState } from 'react';
import toast from 'react-hot-toast';
import { ars } from '../../utils/format';
import { productSpecs } from '../../utils/specLabels';
import { addToStoredCart } from '../../utils/cart';
import styles from './ProductCard.module.css';

// Tarjeta de catálogo con cantidad local, stock y detalle de especificaciones.
export default function ProductCard({ product, name, family }) {
  const [quantity, setQuantity] = useState(1);
  const [showSpecs, setShowSpecs] = useState(false);
  const inStock = product.stock > 0;
  const specs = productSpecs(product.especificaciones, family);

  function addToCart() {
    const cartQuantity = addToStoredCart(product.id, quantity, product.stock);
    toast.success(`${name} agregado al carrito (${cartQuantity} en total).`);
    setQuantity(1);
  }

  return (
    <article className={styles.card}>
      <div className={styles.visual}>
        <span className={styles.family}>{family}</span>
        <span className={styles.productCode}>#{String(product.id).padStart(3, '0')}</span>
      </div>

      <div className={styles.body}>
        <div className={styles.heading}>
          <h2 className={styles.name}>{name}</h2>
          <span className={inStock ? styles.stock : styles.outOfStock}>
            {inStock ? `${product.stock} en stock` : 'Sin stock'}
          </span>
        </div>

        <span className={styles.price}>{ars(product.precio)}</span>

        <button
          className={styles.specsToggle}
          onClick={() => setShowSpecs(current => !current)}
          aria-expanded={showSpecs}
        >
          {showSpecs ? 'Ocultar especificaciones' : 'Ver especificaciones'}
        </button>

        {showSpecs && (
          <dl className={styles.specs}>
            {specs.length > 0 ? specs.map(spec => (
              <div key={spec.label} className={styles.spec}>
                <dt>{spec.label}</dt>
                <dd>{spec.value}{spec.unit}</dd>
              </div>
            )) : <p className={styles.noSpecs}>Sin especificaciones disponibles.</p>}
          </dl>
        )}

        <div className={styles.actions}>
          <div className={styles.quantity}>
            <button
              className={styles.quantityButton}
              onClick={() => setQuantity(current => Math.max(1, current - 1))}
              disabled={!inStock || quantity <= 1}
              aria-label="Quitar una unidad"
            >
              −
            </button>
            <span aria-label={`${quantity} unidades`}>{quantity}</span>
            <button
              className={styles.quantityButton}
              onClick={() => setQuantity(current => Math.min(product.stock, current + 1))}
              disabled={!inStock || quantity >= product.stock}
              aria-label="Agregar una unidad"
            >
              +
            </button>
          </div>
          <button className={styles.addButton} onClick={addToCart} disabled={!inStock}>
            {inStock ? 'Agregar al carrito' : 'No disponible'}
          </button>
        </div>
      </div>
    </article>
  );
}
