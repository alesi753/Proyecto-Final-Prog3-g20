import { useState, useMemo } from 'react';
import { useCategorias, getDescendantIds } from '../../hooks/useCategorias';
import { useProductos } from '../../hooks/useProductos';
import { useMarcas, marcaName, partName } from '../../hooks/useMarcas';
import { ars } from '../../utils/format';
import ProductRow from './ProductRow';
import SpecPanel from './SpecPanel';
import styles from './BuilderStep.module.css';

// Generic, config-driven builder step. Renders the filter chips, product list,
// inline spec panel, and bottom nav for any component category.
//
// `selectedParts` carries every earlier selection so `step.compat` can hard-filter
// the list down to parts compatible with the build so far. When `step.multi` is
// set (RAM, storage), `selected` is an array and the step lets the user stack
// several parts up to a motherboard-derived slot budget.
export default function BuilderStep({ step, stepIndex, selectedParts, selected, onSelect, onRemove, onBack, onContinue }) {
  const groupByMarca = step.groupBy === 'marca';
  const isMulti = !!step.multi;
  const [activeFilter, setActiveFilter] = useState(
    groupByMarca ? 'Todas' : step.filters[0].label
  );
  const [viewingId, setViewingId] = useState(null);

  const { data: categorias, isLoading: catsLoading } = useCategorias();
  const { data: productos,  isLoading: prodsLoading } = useProductos();
  const { data: marcas,     isLoading: marcasLoading } = useMarcas();

  const chosen = isMulti ? (selected ?? []) : null;
  const capacity = isMulti ? step.multi.capacity(selectedParts) : 1;
  const full = isMulti && chosen.length >= capacity;
  const canContinue = isMulti ? chosen.length > 0 : !!selected;

  // Compatibility constraint derived from earlier selections (may be null).
  const compat = useMemo(
    () => (step.compat ? step.compat(selectedParts, categorias) : null),
    [step, selectedParts, categorias]
  );

  // Product pool after the hard compatibility filter, before the chip refinement.
  const pool = useMemo(() => {
    if (!categorias || !productos) return [];

    let result;
    if (compat?.ancestor) {
      const ids = new Set(getDescendantIds(categorias, compat.ancestor));
      result = productos.filter(p => ids.has(p.categoriaId));
    } else if (!groupByMarca) {
      const filterDef = step.filters.find(f => f.label === activeFilter);
      const ids = new Set(getDescendantIds(categorias, filterDef.ancestor));
      result = productos.filter(p => ids.has(p.categoriaId));
    } else {
      result = [];
    }

    if (compat?.predicate) result = result.filter(compat.predicate);
    return result;
  }, [categorias, productos, compat, groupByMarca, activeFilter, step.filters]);

  // Brand chips are derived from the manufacturers actually present in the pool.
  const brandChips = useMemo(() => {
    if (!groupByMarca) return [];
    const names = new Set(pool.map(p => marcaName(marcas, p.marcaId)).filter(Boolean));
    return ['Todas', ...[...names].sort((a, b) => a.localeCompare(b))];
  }, [groupByMarca, pool, marcas]);

  // Final visible list: chip refinement (brand) applied on top of the pool.
  const filtered = useMemo(() => {
    const list = groupByMarca && activeFilter !== 'Todas'
      ? pool.filter(p => marcaName(marcas, p.marcaId) === activeFilter)
      : pool;
    return [...list].sort((a, b) => b.precio - a.precio); // high-end first
  }, [pool, groupByMarca, activeFilter, marcas]);

  const isLoading = catsLoading || prodsLoading || (groupByMarca && marcasLoading);
  const chips = groupByMarca ? brandChips : step.filters.map(f => f.label);

  // How many times a product is in the build (0/1 for single steps).
  const countOf = id =>
    isMulti ? chosen.filter(p => p.id === id).length : (selected?.id === id ? 1 : 0);

  function handleChoose(product) {
    if (isMulti) {
      if (!full) onSelect(product); // keep the panel open for quick repeat adds
    } else {
      onSelect(product);
      setViewingId(null);
    }
  }

  return (
    <section className={styles.step}>
      <p className={styles.eyebrow}>Paso {stepIndex + 1} · {step.eyebrow}</p>
      <h1 className={styles.title}>{step.title}</h1>
      {compat?.note && <p className={styles.subtitle}>{compat.note}</p>}

      {/* Selection tray (multi steps): chosen parts + slot budget */}
      {isMulti && (
        <div className={styles.tray}>
          <div className={styles.trayHead}>
            <span>Seleccionadas</span>
            <span className={styles.trayCount}>{chosen.length}/{capacity}</span>
          </div>
          {chosen.length === 0 ? (
            <p className={styles.trayEmpty}>Todavía no agregaste ninguna.</p>
          ) : (
            chosen.map((p, i) => (
              <div key={i} className={styles.trayItem}>
                <span className={styles.trayName}>{partName(p, marcas)}</span>
                <span className={styles.trayPrice}>{ars(p.precio)}</span>
                <button
                  className={styles.trayRemove}
                  onClick={() => onRemove(i)}
                  aria-label={`Quitar ${partName(p, marcas)}`}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Filter chips: manufacturer brands or static type filters */}
      <div className={styles.filters}>
        {chips.map(label => (
          <button
            key={label}
            className={`${styles.chip} ${activeFilter === label ? styles.chipActive : ''}`}
            onClick={() => { setActiveFilter(label); setViewingId(null); }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Product list */}
      {isLoading ? (
        <p className={styles.status}>Cargando productos…</p>
      ) : filtered.length === 0 ? (
        <p className={styles.status}>No hay productos compatibles disponibles.</p>
      ) : (
        <div className={styles.list}>
          {filtered.map(product => {
            const isViewing  = viewingId === product.id;
            const count      = countOf(product.id);
            const isSelected = count > 0;
            const name       = partName(product, marcas);
            return (
              <div
                key={product.id}
                className={`${styles.row} ${(isViewing || isSelected) ? styles.rowActive : ''}`}
              >
                <ProductRow
                  product={product}
                  name={name}
                  isSelected={isSelected}
                  count={count}
                  onClick={() => setViewingId(prev => (prev === product.id ? null : product.id))}
                />
                {isViewing && (
                  <SpecPanel
                    product={product}
                    specFields={step.specFields}
                    isSelected={isSelected}
                    multi={isMulti}
                    full={full}
                    onChoose={handleChoose}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Navigation */}
      <div className={styles.nav}>
        <button className={styles.backBtn} onClick={onBack}>← Volver</button>
        <button
          className={`${styles.continueBtn} ${canContinue ? styles.continueBtnActive : styles.continueBtnDisabled}`}
          onClick={() => canContinue && onContinue()}
          disabled={!canContinue}
        >
          {canContinue ? 'Continuar →' : 'Elegí una opción'}
        </button>
      </div>
    </section>
  );
}
