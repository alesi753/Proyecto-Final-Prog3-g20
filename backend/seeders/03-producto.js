'use strict';

/**
 * Seeder: Productos del catálogo (hojas del árbol de categorías).
 * Orden: 03 (corre después de categorías y marcas — depende de ambas por FK).
 *
 * ── Contrato de especificaciones (jsonb) ────────────────────────────────────
 * El jsonb es INFORMATIVO (specs completas para el front), pero hay campos
 * OBLIGATORIOS que el validador del POST exige porque las reglas de
 * compatibilidad cuantitativa los necesitan:
 *
 *   Procesador*      → tdp
 *   Placa de Video*  → tdp, longitud_mm
 *   Fuente de Poder* → watts
 *   Gabinete*        → max_gpu_mm
 *   Motherboard*     → ram_tipo, m2_slots
 *
 * Lo que la CATEGORÍA ya captura NO se repite en jsonb:
 *   - socket  → está en la hoja (Procesador AMD AM4 / Motherboard AMD AM4)
 *   - DDR RAM → está en la hoja (Memoria RAM DDR5)
 *   - tipo M.2 → está en la hoja (Almacenamiento SSD M.2 NVME)
 * El resto de campos del jsonb son decorativos (el validador los tolera).
 *
 * ── Nota técnica sobre JSONB + bulkInsert ───────────────────────────────────
 * queryInterface.bulkInsert NO pasa por las definiciones del modelo, así que
 * un objeto JS plano en una columna JSONB puede insertarse como "[object Object]".
 * Por eso serializamos `especificaciones` con JSON.stringify en el boundary del
 * insert (Postgres parsea el string a jsonb sin problema). Los datos se escriben
 * como objetos reales y se stringifican recién al insertar.
 */

module.exports = {
  async up(queryInterface) {
    // ── Resolución de FKs por nombre (desacoplado de los ids) ───────────────
    const [cats] = await queryInterface.sequelize.query(
      'SELECT id, nombre FROM categorias'
    );
    const [marcas] = await queryInterface.sequelize.query(
      'SELECT id, nombre FROM marcas'
    );

    const catId = (nombre) => {
      const c = cats.find((x) => x.nombre === nombre);
      if (!c)
        throw new Error(`[03-producto] Categoría no encontrada: "${nombre}"`);
      return c.id;
    };
    const marcaId = (nombre) => {
      const m = marcas.find((x) => x.nombre === nombre);
      if (!m) throw new Error(`[03-producto] Marca no encontrada: "${nombre}"`);
      return m.id;
    };

    const productos = [
      // ── PROCESADORES ──────────────────────────────────────────────────────
      {
        categoriaId: catId('Procesador AMD AM5'),
        marcaId: marcaId('AMD'),
        modelo: 'Ryzen 5 7600',
        precio: 329999.99,
        stock: 15,
        especificaciones: {
          nucleos: 6,
          hilos: 12,
          frecuencia_base_ghz: 3.8,
          frecuencia_boost_ghz: 5.1,
          tdp: 65,
          grafica_integrada: true,
        },
      },
      {
        categoriaId: catId('Procesador AMD AM5'),
        marcaId: marcaId('AMD'),
        modelo: 'Ryzen 7 7700X',
        precio: 489999.99,
        stock: 8,
        especificaciones: {
          nucleos: 8,
          hilos: 16,
          frecuencia_base_ghz: 4.5,
          frecuencia_boost_ghz: 5.4,
          tdp: 105,
          grafica_integrada: true,
        },
      },
      {
        categoriaId: catId('Procesador AMD AM4'),
        marcaId: marcaId('AMD'),
        modelo: 'Ryzen 5 5600',
        precio: 219999.99,
        stock: 22,
        especificaciones: {
          nucleos: 6,
          hilos: 12,
          frecuencia_base_ghz: 3.5,
          frecuencia_boost_ghz: 4.4,
          tdp: 65,
          grafica_integrada: false,
        },
      },
      {
        categoriaId: catId('Procesador Intel LGA 1700'),
        marcaId: marcaId('Intel'),
        modelo: 'Core i5-12400F',
        precio: 259999.99,
        stock: 18,
        especificaciones: {
          nucleos: 6,
          hilos: 12,
          frecuencia_base_ghz: 2.5,
          frecuencia_boost_ghz: 4.4,
          tdp: 65,
          grafica_integrada: false,
        },
      },
      {
        categoriaId: catId('Procesador Intel LGA 1700'),
        marcaId: marcaId('Intel'),
        modelo: 'Core i7-13700K',
        precio: 619999.99,
        stock: 6,
        especificaciones: {
          nucleos: 16,
          hilos: 24,
          frecuencia_base_ghz: 3.4,
          frecuencia_boost_ghz: 5.4,
          tdp: 125,
          grafica_integrada: true,
        },
      },

      // ── MOTHERBOARDS (ram_tipo + m2_slots obligatorios) ───────────────────
      {
        categoriaId: catId('Motherboard AMD AM5'),
        marcaId: marcaId('ASUS'),
        modelo: 'TUF Gaming B650-PLUS',
        precio: 379999.99,
        stock: 10,
        especificaciones: {
          chipset: 'B650',
          formato: 'ATX',
          ram_tipo: 'DDR5',
          ram_slots: 4,
          ram_max_gb: 128,
          m2_slots: 2,
          puertos_sata: 4,
        },
      },
      {
        categoriaId: catId('Motherboard AMD AM4'),
        marcaId: marcaId('Gigabyte'),
        modelo: 'B550 AORUS ELITE',
        precio: 274999.99,
        stock: 14,
        especificaciones: {
          chipset: 'B550',
          formato: 'ATX',
          ram_tipo: 'DDR4',
          ram_slots: 4,
          ram_max_gb: 128,
          m2_slots: 2,
          puertos_sata: 6,
        },
      },
      {
        categoriaId: catId('Motherboard Intel LGA 1700'),
        marcaId: marcaId('MSI'),
        modelo: 'PRO B760-P',
        precio: 329999.99,
        stock: 11,
        especificaciones: {
          chipset: 'B760',
          formato: 'ATX',
          ram_tipo: 'DDR5',
          ram_slots: 4,
          ram_max_gb: 192,
          m2_slots: 2,
          puertos_sata: 4,
        },
      },
      {
        categoriaId: catId('Motherboard Intel LGA 1700'),
        marcaId: marcaId('ASRock'),
        modelo: 'B660M-HDV',
        precio: 189999.99,
        stock: 9,
        especificaciones: {
          chipset: 'B660',
          formato: 'Micro-ATX',
          ram_tipo: 'DDR4',
          ram_slots: 2,
          ram_max_gb: 64,
          m2_slots: 1,
          puertos_sata: 4,
        },
      },

      // ── PLACAS DE VIDEO (tdp + longitud_mm obligatorios) ──────────────────
      {
        categoriaId: catId('Placa de Video NVIDIA'),
        marcaId: marcaId('ASUS'),
        modelo: 'Dual RTX 4060',
        precio: 449999.99,
        stock: 12,
        especificaciones: {
          vram_gb: 8,
          tipo_vram: 'GDDR6',
          frecuencia_boost_ghz: 2.46,
          tdp: 115,
          longitud_mm: 200,
        },
      },
      {
        categoriaId: catId('Placa de Video NVIDIA'),
        marcaId: marcaId('Gigabyte'),
        modelo: 'WINDFORCE RTX 4070',
        precio: 749999.99,
        stock: 5,
        especificaciones: {
          vram_gb: 12,
          tipo_vram: 'GDDR6X',
          frecuencia_boost_ghz: 2.48,
          tdp: 200,
          longitud_mm: 261,
        },
      },
      {
        categoriaId: catId('Placa de Video AMD'),
        marcaId: marcaId('ASUS'),
        modelo: 'Dual RX 7600',
        precio: 399999.99,
        stock: 7,
        especificaciones: {
          vram_gb: 8,
          tipo_vram: 'GDDR6',
          frecuencia_boost_ghz: 2.66,
          tdp: 165,
          longitud_mm: 204,
        },
      },

      // ── MEMORIA RAM (DDR viene de la categoría; jsonb decorativo) ─────────
      {
        categoriaId: catId('Memoria RAM DDR5'),
        marcaId: marcaId('Corsair'),
        modelo: 'Vengeance 16GB 5600',
        precio: 89999.99,
        stock: 25,
        especificaciones: {
          capacidad_gb: 16,
          modulos: '1x16GB',
          frecuencia_mhz: 5600,
          latencia: 'CL36',
        },
      },
      {
        categoriaId: catId('Memoria RAM DDR4'),
        marcaId: marcaId('Kingston'),
        modelo: 'Fury Beast 16GB 3200',
        precio: 64999.99,
        stock: 30,
        especificaciones: {
          capacidad_gb: 16,
          modulos: '1x16GB',
          frecuencia_mhz: 3200,
          latencia: 'CL16',
        },
      },

      // ── ALMACENAMIENTO (tipo viene de la categoría; jsonb decorativo) ─────
      {
        categoriaId: catId('Almacenamiento SSD M.2 NVME'),
        marcaId: marcaId('Samsung'),
        modelo: '980 1TB',
        precio: 99999.99,
        stock: 20,
        especificaciones: {
          capacidad_gb: 1000,
          interfaz: 'PCIe 3.0 x4',
          lectura_mbs: 3500,
          escritura_mbs: 3000,
        },
      },
      {
        categoriaId: catId('Almacenamiento HDD'),
        marcaId: marcaId('Seagate'),
        modelo: 'Barracuda 2TB',
        precio: 74999.99,
        stock: 16,
        especificaciones: {
          capacidad_gb: 2000,
          rpm: 7200,
          cache_mb: 256,
          formato: '3.5"',
        },
      },

      // ── FUENTES (watts obligatorio) ───────────────────────────────────────
      {
        categoriaId: catId('Fuente de Poder Certificada'),
        marcaId: marcaId('Corsair'),
        modelo: 'RM750',
        precio: 159999.99,
        stock: 13,
        especificaciones: {
          watts: 750,
          certificacion: '80+ Gold',
          modular: 'Full',
        },
      },
      {
        categoriaId: catId('Fuente de Poder Genérica'),
        marcaId: marcaId('Thermaltake'),
        modelo: 'Litepower 500W',
        precio: 49999.99,
        stock: 19,
        especificaciones: {
          watts: 500,
          certificacion: 'Ninguna',
          modular: 'No',
        },
      },

      // ── GABINETES (max_gpu_mm obligatorio) ────────────────────────────────
      {
        categoriaId: catId('Gabinete Mid-Tower'),
        marcaId: marcaId('NZXT'),
        modelo: 'H5 Flow',
        precio: 134999.99,
        stock: 9,
        especificaciones: {
          formato: 'ATX',
          max_gpu_mm: 365,
          ventiladores_incluidos: 2,
          panel_lateral: 'Vidrio templado',
        },
      },
      {
        categoriaId: catId('Gabinete Mini-Tower'),
        marcaId: marcaId('Cooler Master'),
        modelo: 'Elite 110',
        precio: 69999.99,
        stock: 11,
        especificaciones: {
          formato: 'Mini-ITX',
          max_gpu_mm: 244,
          ventiladores_incluidos: 1,
          panel_lateral: 'Acero',
        },
      },

      // ── MONITOR ───────────────────────────────────────────────────────────
      {
        categoriaId: catId('Monitor Gamer'),
        marcaId: marcaId('LG'),
        modelo: 'UltraGear 27GL850',
        precio: 449999.99,
        stock: 6,
        especificaciones: {
          pulgadas: 27,
          resolucion: '2560x1440',
          refresco_hz: 144,
          panel: 'IPS',
          tiempo_respuesta_ms: 1,
        },
      },

      // ── PERIFÉRICOS (jsonb decorativo, sin reglas de compatibilidad) ──────
      {
        categoriaId: catId('Teclado Gamer Con Cable'),
        marcaId: marcaId('Redragon'),
        modelo: 'Kumara K552',
        precio: 34999.99,
        stock: 28,
        especificaciones: {
          switch: 'Outemu Red',
          iluminacion: 'RGB',
          layout: 'TKL',
          conexion: 'USB',
        },
      },
      {
        categoriaId: catId('Mouse Gamer Con Cable'),
        marcaId: marcaId('Logitech'),
        modelo: 'G203 LIGHTSYNC',
        precio: 24999.99,
        stock: 35,
        especificaciones: {
          dpi: 8000,
          sensor: 'Mercury',
          botones: 6,
          iluminacion: 'RGB',
        },
      },
      {
        categoriaId: catId('Auriculares Gamer Con Cable'),
        marcaId: marcaId('HyperX'),
        modelo: 'Cloud II',
        precio: 89999.99,
        stock: 17,
        especificaciones: {
          drivers_mm: 53,
          microfono: true,
          surround: '7.1',
          conexion: 'USB / 3.5mm',
        },
      },
    ];

    // Serializa el jsonb en el boundary del insert (ver nota técnica arriba).
    await queryInterface.bulkInsert(
      'productos',
      productos.map((p) => ({
        ...p,
        especificaciones: JSON.stringify(p.especificaciones),
      })),
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('productos', null, {});
  },
};
