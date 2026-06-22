import { getDescendantIds } from '../../hooks/useCategorias';

// Configuration for the 7 builder steps. Each entry drives one screen of the
// wizard via the generic <BuilderStep>. `slot` keys match BuildSidebar's SLOTS.
//
// `filters[].ancestor` is a category name passed to getDescendantIds() — it works
// whether it points at a mid-level node (Procesador AMD → AM5/AM4/AM3) or a leaf
// (Memoria RAM DDR5). `specFields` are read from product.especificaciones; fields
// the product doesn't have are skipped automatically.
//
// `compat(selectedParts, categorias)` derives a HARD compatibility constraint from
// earlier selections and returns { ancestor?, predicate?, note? }:
//   · ancestor  — category name restricting the product pool (via getDescendantIds)
//   · predicate — extra per-product numeric test (product => boolean)
//   · note      — subtitle shown under the title so the constraint is visible
// `groupBy: 'marca'` replaces the static type chips with dynamic manufacturer chips.

// Watt buffer required on top of raw CPU+GPU TDP, covering RAM, drives and fans.
const PSU_HEADROOM_W = 150;

const nameOf = (categorias, categoriaId) =>
  categorias?.find(c => c.id === categoriaId)?.nombre ?? '';

export const STEPS = [
  {
    slot: 'cpu',
    eyebrow: 'Procesador',
    title: 'Elegí tu procesador',
    filters: [
      { label: 'AMD',   ancestor: 'Procesador AMD' },
      { label: 'Intel', ancestor: 'Procesador Intel' },
    ],
    specFields: [
      { label: 'Núcleos',     key: 'nucleos' },
      { label: 'Hilos',       key: 'hilos' },
      { label: 'Freq. base',  key: 'frecuencia_base_ghz',  unit: ' GHz' },
      { label: 'Freq. boost', key: 'frecuencia_boost_ghz', unit: ' GHz' },
      { label: 'TDP',         key: 'tdp', unit: ' W' },
    ],
  },
  {
    slot: 'mb',
    eyebrow: 'Motherboard',
    title: 'Elegí tu motherboard',
    // Socket lives in the category leaf name; the CPU's category maps 1:1 to the
    // motherboard one by swapping the family prefix (Procesador AMD AM5 → Motherboard AMD AM5).
    // Socket token = name minus the "Procesador <brand>" prefix (AM5, LGA 1700…).
    compat: (parts, categorias) => {
      const cpuName = nameOf(categorias, parts.cpu?.categoriaId);
      return {
        ancestor: cpuName.replace('Procesador', 'Motherboard'),
        note: `Socket ${cpuName.split(' ').slice(2).join(' ')}`,
      };
    },
    groupBy: 'marca',
    specFields: [
      { label: 'Chipset',      key: 'chipset' },
      { label: 'Formato',      key: 'formato' },
      { label: 'Tipo RAM',     key: 'ram_tipo' },
      { label: 'Slots RAM',    key: 'ram_slots' },
      { label: 'RAM máx',      key: 'ram_max_gb', unit: ' GB' },
      { label: 'Slots M.2',    key: 'm2_slots' },
      { label: 'Puertos SATA', key: 'puertos_sata' },
    ],
  },
  {
    slot: 'ram',
    eyebrow: 'Memoria RAM',
    title: 'Elegí tu memoria RAM',
    // The motherboard dictates the RAM generation via especificaciones.ram_tipo,
    // which matches the leaf category name (Memoria RAM DDR5).
    compat: (parts) => {
      const tipo = parts.mb?.especificaciones?.ram_tipo;
      return {
        ancestor: `Memoria RAM ${tipo}`,
        note: tipo ? `RAM ${tipo}` : null,
      };
    },
    groupBy: 'marca',
    // One stick per RAM slot on the board (simple count, kits aside).
    multi: { capacity: (parts) => Number(parts.mb?.especificaciones?.ram_slots ?? 1) || 1 },
    specFields: [
      { label: 'Capacidad',  key: 'capacidad_gb', unit: ' GB' },
      { label: 'Módulos',    key: 'modulos' },
      { label: 'Frecuencia', key: 'frecuencia_mhz', unit: ' MHz' },
      { label: 'Latencia',   key: 'latencia' },
    ],
  },
  {
    slot: 'storage',
    eyebrow: 'Almacenamiento',
    title: 'Elegí tu almacenamiento',
    filters: [
      { label: 'SSD', ancestor: 'Almacenamiento SSD' },
      { label: 'HDD', ancestor: 'Almacenamiento HDD' },
    ],
    // A board with no M.2 slots can't take M.2 drives — hide that subtree.
    compat: (parts, categorias) => {
      const m2Slots = Number(parts.mb?.especificaciones?.m2_slots ?? 0);
      if (m2Slots >= 1) return null;
      const m2Ids = new Set(getDescendantIds(categorias, 'Almacenamiento SSD M.2'));
      return {
        predicate: p => !m2Ids.has(p.categoriaId),
        note: 'M.2 = 0 slots',
      };
    },
    // One drive per M.2 slot + SATA port on the board (simple count).
    multi: {
      capacity: (parts) => {
        const e = parts.mb?.especificaciones ?? {};
        return Number(e.m2_slots ?? 0) + Number(e.puertos_sata ?? 0) || 1;
      },
    },
    // Superset of SSD + HDD fields; SpecPanel skips whatever a product lacks.
    specFields: [
      { label: 'Capacidad', key: 'capacidad_gb', unit: ' GB' },
      { label: 'Interfaz',  key: 'interfaz' },
      { label: 'Lectura',   key: 'lectura_mbs', unit: ' MB/s' },
      { label: 'Escritura', key: 'escritura_mbs', unit: ' MB/s' },
      { label: 'RPM',       key: 'rpm' },
      { label: 'Caché',     key: 'cache_mb', unit: ' MB' },
      { label: 'Formato',   key: 'formato' },
    ],
  },
  {
    slot: 'gpu',
    eyebrow: 'Placa de Video',
    title: 'Elegí tu placa de video',
    filters: [
      { label: 'NVIDIA', ancestor: 'Placa de Video NVIDIA' },
      { label: 'AMD',    ancestor: 'Placa de Video AMD' },
      { label: 'Intel',  ancestor: 'Placa de Video Intel' },
    ],
    specFields: [
      { label: 'VRAM',        key: 'vram_gb', unit: ' GB' },
      { label: 'Tipo VRAM',   key: 'tipo_vram' },
      { label: 'Freq. boost', key: 'frecuencia_boost_ghz', unit: ' GHz' },
      { label: 'TDP',         key: 'tdp', unit: ' W' },
      { label: 'Longitud',    key: 'longitud_mm', unit: ' mm' },
    ],
  },
  {
    slot: 'psu',
    eyebrow: 'Fuente de Poder',
    title: 'Elegí tu fuente de poder',
    filters: [
      { label: 'Certificada', ancestor: 'Fuente de Poder Certificada' },
      { label: 'Genérica',    ancestor: 'Fuente de Poder Genérica' },
    ],
    // PSU must cover CPU + GPU draw plus headroom for the rest of the system.
    compat: (parts) => {
      const cpuTdp = Number(parts.cpu?.especificaciones?.tdp ?? 0);
      const gpuTdp = Number(parts.gpu?.especificaciones?.tdp ?? 0);
      const required = cpuTdp + gpuTdp + PSU_HEADROOM_W;
      return {
        predicate: p => Number(p.especificaciones?.watts ?? 0) >= required,
        note: `≥ ${required} W`,
      };
    },
    specFields: [
      { label: 'Potencia',      key: 'watts', unit: ' W' },
      { label: 'Certificación', key: 'certificacion' },
      { label: 'Modular',       key: 'modular' },
    ],
  },
  {
    slot: 'case',
    eyebrow: 'Gabinete',
    title: 'Elegí tu gabinete',
    filters: [
      { label: 'Full-Tower', ancestor: 'Gabinete Full-Tower' },
      { label: 'Mid-Tower',  ancestor: 'Gabinete Mid-Tower' },
      { label: 'Mini-Tower', ancestor: 'Gabinete Mini-Tower' },
    ],
    // The case must physically fit the chosen GPU.
    compat: (parts) => {
      const gpuLen = Number(parts.gpu?.especificaciones?.longitud_mm ?? 0);
      return {
        predicate: p => Number(p.especificaciones?.max_gpu_mm ?? 0) >= gpuLen,
        note: gpuLen ? `Clearance ≥ ${gpuLen} mm` : null,
      };
    },
    specFields: [
      { label: 'Formato',       key: 'formato' },
      { label: 'GPU máx',       key: 'max_gpu_mm', unit: ' mm' },
      { label: 'Ventiladores',  key: 'ventiladores_incluidos' },
      { label: 'Panel lateral', key: 'panel_lateral' },
    ],
  },
];
