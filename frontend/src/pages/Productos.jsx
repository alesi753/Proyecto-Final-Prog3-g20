import { useMemo, useState } from 'react';
import { useCategorias, getDescendantIds, getFamilyName } from '../hooks/useCategorias';
import { useProductos } from '../hooks/useProductos';
import { useMarcas, marcaName, partName } from '../hooks/useMarcas';
import ProductCard from '../components/products/ProductCard';
import styles from './Productos.module.css';

// Catálogo público: filtra en el cliente porque la API devuelve todos los productos.
export default function Productos() {
  const [activeFamily, setActiveFamily] = useState('Todas');
  const [activeBrand, setActiveBrand] = useState('Todas');
  const [search, setSearch] = useState('');
  const [priceOrder, setPriceOrder] = useState('default');
  const [onlyInStock, setOnlyInStock] = useState(false);

  const { data: categorias, isLoading: categoriesLoading } = useCategorias();
  const { data: productos, isLoading: productsLoading } = useProductos();
  const { data: marcas, isLoading: brandsLoading } = useMarcas();

  // Familias de primer nivel: son las opciones principales del catálogo.
  const families = useMemo(() => {
    if (!categorias) return [];
    const rootIds = new Set(categorias.filter(category => category.padreId === null).map(category => category.id));
    return categorias
      .filter(category => rootIds.has(category.padreId))
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [categorias]);

  // Productos pertenecientes a la familia elegida antes de aplicar filtros secundarios.
  const familyPool = useMemo(() => {
    if (!productos || !categorias || activeFamily === 'Todas') return productos ?? [];
    const familyIds = new Set(getDescendantIds(categorias, activeFamily));
    return productos.filter(product => familyIds.has(product.categoriaId));
  }, [productos, categorias, activeFamily]);

  // Solo se ofrecen marcas que realmente tienen productos dentro de la familia actual.
  const brands = useMemo(() => {
    if (!marcas) return [];
    const usedIds = new Set(familyPool.map(product => product.marcaId));
    return marcas
      .filter(brand => usedIds.has(brand.id))
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [marcas, familyPool]);

  const visibleProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('es-AR');
    const list = familyPool.filter(product => {
      const name = partName(product, marcas).toLocaleLowerCase('es-AR');
      const isCorrectBrand = activeBrand === 'Todas' || marcaName(marcas, product.marcaId) === activeBrand;
      const matchesSearch = !normalizedSearch || name.includes(normalizedSearch);
      return isCorrectBrand && matchesSearch && (!onlyInStock || product.stock > 0);
    });

    if (priceOrder === 'asc') return [...list].sort((a, b) => Number(a.precio) - Number(b.precio));
    if (priceOrder === 'desc') return [...list].sort((a, b) => Number(b.precio) - Number(a.precio));
    return list;
  }, [familyPool, marcas, activeBrand, search, onlyInStock, priceOrder]);

  const isLoading = categoriesLoading || productsLoading || brandsLoading;

  function chooseFamily(family) {
    setActiveFamily(family);
    setActiveBrand('Todas');
  }

  return (
    <main className={styles.page}>
      <p className={styles.eyebrow}>Componentes y periféricos</p>
      <h1 className={styles.title}>Encontrá cada pieza para tu setup.</h1>
      <p className={styles.subtitle}>
        Explorá el catálogo, compará especificaciones y agregá lo que necesitás al carrito.
      </p>

      <section className={styles.filters} aria-label="Filtros de productos">
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Categoría</span>
          <div className={styles.chips}>
            <button
              className={`${styles.chip} ${activeFamily === 'Todas' ? styles.chipActive : ''}`}
              onClick={() => chooseFamily('Todas')}
            >
              Todas
            </button>
            {families.map(family => (
              <button
                key={family.id}
                className={`${styles.chip} ${activeFamily === family.nombre ? styles.chipActive : ''}`}
                onClick={() => chooseFamily(family.nombre)}
              >
                {family.nombre}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Marca</span>
          <div className={styles.chips}>
            <button
              className={`${styles.chip} ${activeBrand === 'Todas' ? styles.chipActive : ''}`}
              onClick={() => setActiveBrand('Todas')}
            >
              Todas
            </button>
            {brands.map(brand => (
              <button
                key={brand.id}
                className={`${styles.chip} ${activeBrand === brand.nombre ? styles.chipActive : ''}`}
                onClick={() => setActiveBrand(brand.nombre)}
              >
                {brand.nombre}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.controls}>
          <label className={styles.searchLabel}>
            <span>Buscar</span>
            <input
              type="search"
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Marca o modelo"
            />
          </label>

          <label className={styles.selectLabel}>
            <span>Ordenar</span>
            <select value={priceOrder} onChange={event => setPriceOrder(event.target.value)}>
              <option value="default">Predeterminado</option>
              <option value="asc">Menor precio</option>
              <option value="desc">Mayor precio</option>
            </select>
          </label>

          <label className={styles.stockFilter}>
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={event => setOnlyInStock(event.target.checked)}
            />
            Solo con stock
          </label>
        </div>
      </section>

      {isLoading ? (
        <p className={styles.status}>Cargando productos...</p>
      ) : visibleProducts.length === 0 ? (
        <p className={styles.status}>No se encontraron productos con esos filtros.</p>
      ) : (
        <>
          <p className={styles.count}>{visibleProducts.length} productos encontrados</p>
          <section className={styles.grid} aria-label="Productos disponibles">
            {visibleProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                name={partName(product, marcas)}
                family={getFamilyName(categorias, product.categoriaId)}
              />
            ))}
          </section>
        </>
      )}
    </main>
  );
}
