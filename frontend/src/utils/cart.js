// Clave y formato compartidos con Carrito.jsx: "id:cantidad,id:cantidad".
const CART_KEY = 'pc_cart_items';

function readCart() {
  const raw = localStorage.getItem(CART_KEY);
  if (!raw) return [];

  return raw.split(',')
    .map(pair => {
      const [idStr, qtyStr] = pair.split(':');
      const id = Number(idStr);
      const qty = Number(qtyStr);
      return { id, qty };
    })
    .filter(item => Number.isFinite(item.id) && item.id > 0 && Number.isFinite(item.qty) && item.qty > 0);
}

// Agrega unidades a la copia persistente del carrito sin superar el stock actual.
export function addToStoredCart(productId, quantity, stock) {
  const items = readCart();
  const current = items.find(item => item.id === productId);
  const nextQuantity = Math.min((current?.qty ?? 0) + quantity, stock);

  const nextItems = current
    ? items.map(item => (item.id === productId ? { ...item, qty: nextQuantity } : item))
    : [...items, { id: productId, qty: nextQuantity }];

  localStorage.setItem(CART_KEY, nextItems.map(item => `${item.id}:${item.qty}`).join(','));
  return nextQuantity;
}
