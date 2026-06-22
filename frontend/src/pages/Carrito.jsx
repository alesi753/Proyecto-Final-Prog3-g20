import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { useProductos } from '../hooks/useProductos';
import { useMarcas, partName } from '../hooks/useMarcas';
import { useOrdenes } from '../hooks/useOrdenes';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { ars } from '../utils/format';
import CartLine from '../components/cart/CartLine';
import OrderHistory from '../components/cart/OrderHistory';
import styles from './Carrito.module.css';

// Durable backup of the cart so it survives reloads and arriving at /carrito
// without the ?items query (e.g. via the Navbar link). The URL stays the live,
// shareable copy; localStorage is the fallback.
const CART_KEY = 'pc_cart_items';

// The cart is client-side state in the URL (?items=id:qty,…), seeded from the
// build. The server cart is only touched at checkout: clear it, push the current
// lines, then POST /ordenes/checkout (which builds the order and empties the cart).
export default function Carrito() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const queryClient = useQueryClient();

  const { data: productos } = useProductos();
  const { data: marcas } = useMarcas();
  const { data: ordenes = [], isLoading: ordersLoading } = useOrdenes(isAuthenticated);

  const [buying, setBuying] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const byId = useMemo(() => {
    const map = new Map();
    (productos ?? []).forEach(p => map.set(p.id, p));
    return map;
  }, [productos]);

  const items = useMemo(() => {
    const raw = searchParams.get('items');
    if (!raw) return [];
    return raw
      .split(',')
      .map(pair => {
        const [idStr, qtyStr] = pair.split(':');
        const id = Number(idStr);
        const qty = qtyStr === undefined ? 1 : Number(qtyStr);
        return { id, qty: Number.isFinite(qty) ? Math.max(0, qty) : 1 };
      })
      .filter(x => x.id);
  }, [searchParams]);

  const lines = useMemo(
    () => items.map(({ id, qty }) => {
      const product = byId.get(id);
      return product ? { product, qty } : null;
    }).filter(Boolean),
    [items, byId]
  );

  const total = lines.reduce((sum, { product, qty }) => sum + Number(product.precio) * qty, 0);
  const purchasable = lines.filter(l => l.qty > 0);

  function writeItems(nextItems) {
    const serialized = nextItems.map(x => `${x.id}:${x.qty}`).join(',');
    const next = new URLSearchParams(searchParams);
    if (serialized) {
      next.set('items', serialized);
      localStorage.setItem(CART_KEY, serialized);
    } else {
      next.delete('items');
      localStorage.removeItem(CART_KEY); // e.g. cleared after checkout
    }
    setSearchParams(next, { replace: true });
  }

  // On mount: persist a cart that arrived via the URL (from the builder), or
  // restore the saved one when we landed on a bare /carrito. Runs once.
  useEffect(() => {
    const raw = searchParams.get('items');
    if (raw) {
      localStorage.setItem(CART_KEY, raw);
    } else {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) {
        const next = new URLSearchParams(searchParams);
        next.set('items', saved);
        setSearchParams(next, { replace: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Quantities floor at 0 and the line stays, so a mistaken last "−" is undoable with "+".
  const addOne = id => writeItems(items.map(x => (x.id === id ? { ...x, qty: x.qty + 1 } : x)));
  const removeOne = id =>
    writeItems(items.map(x => (x.id === id ? { ...x, qty: Math.max(0, x.qty - 1) } : x)));
  const clearCart = () => writeItems([]);

  async function handleBuy() {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname + location.search } });
      return;
    }
    if (purchasable.length === 0) {
      toast.error('Agregá al menos un producto.');
      return;
    }
    setBuying(true);
    try {
      // Push each purchasable line (qty > 0) to the server cart. `agregar`
      // increments, so we `remover` first (404 if absent → ignore) to set each
      // product to exactly `qty` — this also makes a retry after a partial failure
      // idempotent. We can't enumerate the cart to clear it wholesale, since
      // GET /carrito doesn't return its items.
      for (const { product, qty } of purchasable) {
        await api.delete(`/carrito/remover/${product.id}`).catch(() => {});
        await api.post('/carrito/agregar', { productoId: product.id, cantidad: qty });
      }
      const { data } = await api.post('/ordenes/checkout');
      toast.success(`¡Compra realizada! Orden #${data.orden.id}`);
      setPlacedOrder(data.orden);
      writeItems([]); // empty the local cart
      queryClient.invalidateQueries('ordenes'); // new order shows on the next view
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        logout();
        toast.error('Tu sesión expiró. Iniciá sesión de nuevo.');
        navigate('/login', { state: { from: location.pathname + location.search } });
      } else {
        toast.error(err.response?.data?.message ?? 'No se pudo completar la compra.');
      }
    } finally {
      setBuying(false);
    }
  }

  if (placedOrder) {
    return (
      <div className={styles.page}>
        <div className={styles.empty}>
          <h1 className={styles.title}>¡Gracias por tu compra!</h1>
          <p className={styles.emptyText}>
            Orden <strong>#{placedOrder.id}</strong> registrada · Total {ars(placedOrder.precioTotal)}
          </p>
          <Link to="/builder" className={styles.cta}>Armar otra PC →</Link>
        </div>
      </div>
    );
  }

  const hasCart = lines.length > 0;
  const showHistory = isAuthenticated && ordenes.length > 0;
  // Hide the "empty" CTA while there could still be orders coming in.
  const showEmpty = !hasCart && !showHistory && !(isAuthenticated && ordersLoading);

  return (
    <div className={styles.page}>
      <p className={styles.eyebrow}>Carrito</p>
      <h1 className={styles.title}>Tu pedido</h1>

      {hasCart && (
        <>
          <div className={styles.list}>
            {lines.map(({ product, qty }) => (
              <CartLine
                key={product.id}
                name={partName(product, marcas)}
                qty={qty}
                unitPrice={Number(product.precio)}
                stock={product.stock}
                onAddOne={() => addOne(product.id)}
                onRemoveOne={() => removeOne(product.id)}
              />
            ))}
          </div>

          <div className={styles.footer}>
            <div className={styles.total}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalValue}>{ars(total)}</span>
            </div>
            <div className={styles.actions}>
              <button className={styles.clear} onClick={clearCart} disabled={buying}>
                Vaciar carrito
              </button>
              <button
                className={styles.buy}
                onClick={handleBuy}
                disabled={buying || purchasable.length === 0}
              >
                {buying ? 'Procesando…' : isAuthenticated ? 'Comprar →' : 'Ingresá para comprar →'}
              </button>
            </div>
          </div>
        </>
      )}

      {showEmpty && (
        <div className={styles.empty}>
          <p className={styles.emptyText}>Tu carrito está vacío.</p>
          <Link to="/builder" className={styles.cta}>Armá tu PC →</Link>
        </div>
      )}

      {showHistory && <OrderHistory ordenes={ordenes} byId={byId} marcas={marcas} />}
    </div>
  );
}
