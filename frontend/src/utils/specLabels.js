// Etiquetas y unidades conocidas para mostrar especificaciones del catálogo.
const SPEC_FIELDS_BY_FAMILY = {
  Procesador: [
    { label: 'Núcleos', key: 'nucleos' },
    { label: 'Hilos', key: 'hilos' },
    { label: 'Freq. base', key: 'frecuencia_base_ghz', unit: ' GHz' },
    { label: 'Freq. boost', key: 'frecuencia_boost_ghz', unit: ' GHz' },
    { label: 'TDP', key: 'tdp', unit: ' W' },
  ],
  Motherboard: [
    { label: 'Chipset', key: 'chipset' },
    { label: 'Formato', key: 'formato' },
    { label: 'Tipo RAM', key: 'ram_tipo' },
    { label: 'Slots RAM', key: 'ram_slots' },
    { label: 'RAM máx.', key: 'ram_max_gb', unit: ' GB' },
    { label: 'Slots M.2', key: 'm2_slots' },
    { label: 'Puertos SATA', key: 'puertos_sata' },
  ],
  'Memoria RAM': [
    { label: 'Capacidad', key: 'capacidad_gb', unit: ' GB' },
    { label: 'Módulos', key: 'modulos' },
    { label: 'Frecuencia', key: 'frecuencia_mhz', unit: ' MHz' },
    { label: 'Latencia', key: 'latencia' },
  ],
  'Placa de Video': [
    { label: 'VRAM', key: 'vram_gb', unit: ' GB' },
    { label: 'Tipo VRAM', key: 'tipo_vram' },
    { label: 'Freq. boost', key: 'frecuencia_boost_ghz', unit: ' GHz' },
    { label: 'TDP', key: 'tdp', unit: ' W' },
    { label: 'Longitud', key: 'longitud_mm', unit: ' mm' },
  ],
  Almacenamiento: [
    { label: 'Capacidad', key: 'capacidad_gb', unit: ' GB' },
    { label: 'Interfaz', key: 'interfaz' },
    { label: 'Lectura', key: 'lectura_mbs', unit: ' MB/s' },
    { label: 'Escritura', key: 'escritura_mbs', unit: ' MB/s' },
    { label: 'RPM', key: 'rpm' },
    { label: 'Caché', key: 'cache_mb', unit: ' MB' },
    { label: 'Formato', key: 'formato' },
  ],
  'Fuente de Poder': [
    { label: 'Potencia', key: 'watts', unit: ' W' },
    { label: 'Certificación', key: 'certificacion' },
    { label: 'Modular', key: 'modular' },
  ],
  Gabinete: [
    { label: 'Formato', key: 'formato' },
    { label: 'GPU máx.', key: 'max_gpu_mm', unit: ' mm' },
    { label: 'Ventiladores', key: 'ventiladores_incluidos' },
    { label: 'Panel lateral', key: 'panel_lateral' },
  ],
  Monitor: [
    { label: 'Pulgadas', key: 'pulgadas', unit: ' pulgadas' },
    { label: 'Resolución', key: 'resolucion' },
    { label: 'Refresco', key: 'refresco_hz', unit: ' Hz' },
    { label: 'Panel', key: 'panel' },
    { label: 'Respuesta', key: 'tiempo_respuesta_ms', unit: ' ms' },
  ],
  Teclado: [
    { label: 'Switch', key: 'switch' },
    { label: 'Iluminación', key: 'iluminacion' },
    { label: 'Layout', key: 'layout' },
    { label: 'Conexión', key: 'conexion' },
  ],
  Mouse: [
    { label: 'DPI', key: 'dpi' },
    { label: 'Sensor', key: 'sensor' },
    { label: 'Botones', key: 'botones' },
    { label: 'Iluminación', key: 'iluminacion' },
  ],
  Auriculares: [
    { label: 'Drivers', key: 'drivers_mm', unit: ' mm' },
    { label: 'Micrófono', key: 'microfono' },
    { label: 'Surround', key: 'surround' },
    { label: 'Conexión', key: 'conexion' },
  ],
};

// Convierte claves JSON desconocidas en etiquetas legibles para nuevas familias.
function humanizeKey(key) {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, letter => letter.toUpperCase());
}

// Devuelve las especificaciones disponibles con etiqueta, valor y unidad.
export function productSpecs(especificaciones, family) {
  const specs = especificaciones ?? {};
  const configuredFields = SPEC_FIELDS_BY_FAMILY[family] ?? [];
  const configuredKeys = new Set(configuredFields.map(field => field.key));
  const visibleConfigured = configuredFields.filter(field => specs[field.key] !== undefined);
  const fallbackFields = Object.keys(specs)
    .filter(key => !configuredKeys.has(key))
    .map(key => ({ label: humanizeKey(key), key }));

  return [...visibleConfigured, ...fallbackFields].map(({ label, key, unit = '' }) => ({
    label,
    value: typeof specs[key] === 'boolean' ? (specs[key] ? 'Sí' : 'No') : specs[key],
    unit,
  }));
}
