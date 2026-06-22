import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BuildSidebar from '../components/builder/BuildSidebar';
import BuilderStep from '../components/builder/BuilderStep';
import { STEPS } from '../components/builder/builderSteps';
import { useProductos } from '../hooks/useProductos';
import styles from './Builder.module.css';

const SLOTS = STEPS.map(s => s.slot);
const MULTI = new Set(STEPS.filter(s => s.multi).map(s => s.slot)); // ram, storage

// The build lives entirely in the URL: ?cpu=12&mb=34&ram=5,5&…&step=2 holds product
// IDs plus the active step. Multi-slot components (RAM, storage) store a comma-list
// of IDs (duplicates = quantity). Full product objects are rehydrated from the
// react-query cache, so reloading, sharing the link, or using browser back all just
// work, and nothing in the URL can go stale (prices/stock come from the catalog).
export default function Builder() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: productos } = useProductos();

  const byId = useMemo(() => {
    const map = new Map();
    (productos ?? []).forEach(p => map.set(p.id, p));
    return map;
  }, [productos]);

  const selectedParts = useMemo(() => {
    const parts = {};
    SLOTS.forEach(slot => {
      if (MULTI.has(slot)) {
        const raw = searchParams.get(slot);
        parts[slot] = raw
          ? raw.split(',').filter(Boolean).map(Number).map(id => byId.get(id)).filter(Boolean)
          : [];
      } else {
        const id = Number(searchParams.get(slot));
        parts[slot] = id ? byId.get(id) ?? null : null;
      }
    });
    return parts;
  }, [searchParams, byId]);

  const currentStep = Math.min(
    Math.max(Number(searchParams.get('step')) || 0, 0),
    STEPS.length - 1
  );

  // Single-slot pick: replace the value and drop downstream slots, since changing
  // an upstream part can invalidate everything chosen after it (new socket, RAM type…).
  function selectPart(key, product) {
    if (Number(searchParams.get(key)) === product.id) return; // no change → keep downstream
    const next = new URLSearchParams(searchParams);
    next.set(key, String(product.id));
    SLOTS.slice(SLOTS.indexOf(key) + 1).forEach(slot => next.delete(slot));
    setSearchParams(next, { replace: true });
  }

  // Multi-slot add: append an ID. RAM/storage feed no later compatibility check,
  // so there's nothing downstream to clear.
  function addPart(key, product) {
    const ids = (searchParams.get(key) || '').split(',').filter(Boolean);
    ids.push(String(product.id));
    const next = new URLSearchParams(searchParams);
    next.set(key, ids.join(','));
    setSearchParams(next, { replace: true });
  }

  function removePart(key, index) {
    const ids = (searchParams.get(key) || '').split(',').filter(Boolean);
    ids.splice(index, 1);
    const next = new URLSearchParams(searchParams);
    if (ids.length) next.set(key, ids.join(','));
    else next.delete(key);
    setSearchParams(next, { replace: true });
  }

  function goToStep(index) {
    const next = new URLSearchParams(searchParams);
    next.set('step', String(index));
    setSearchParams(next); // push → browser back walks the wizard
  }

  // Aggregate the build into "id:qty,…" line items for the cart (duplicates in a
  // multi-slot become quantity).
  function finishToCart() {
    const counts = new Map();
    SLOTS.forEach(slot => {
      const v = selectedParts[slot];
      const list = Array.isArray(v) ? v : v ? [v] : [];
      list.forEach(p => counts.set(p.id, (counts.get(p.id) ?? 0) + 1));
    });
    const items = [...counts].map(([id, qty]) => `${id}:${qty}`).join(',');
    navigate(`/carrito?items=${items}`);
  }

  const step = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;
  const isMultiStep = !!step.multi;

  return (
    <div className={styles.layout}>
      <BuildSidebar
        selectedParts={selectedParts}
        currentStep={currentStep}
        onNavigate={goToStep}
      />
      <BuilderStep
        key={step.slot}                 // remount on step change → resets filter/viewing state
        step={step}
        stepIndex={currentStep}
        selectedParts={selectedParts}
        selected={selectedParts[step.slot]}
        onSelect={product => (isMultiStep ? addPart : selectPart)(step.slot, product)}
        onRemove={isMultiStep ? index => removePart(step.slot, index) : undefined}
        onBack={() => currentStep === 0 ? navigate('/') : goToStep(currentStep - 1)}
        onContinue={() => isLastStep ? finishToCart() : goToStep(currentStep + 1)}
      />
    </div>
  );
}
