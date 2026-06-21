'use strict';

/**
 * Seeder: Categorías de componentes de PC (árbol jerárquico vía padreId).
 * Orden: 01 (sin dependencias — corre antes que marcas y productos).
 *
 * `nombre` es la clave semántica que usa el validador de especificaciones.
 * Las hojas (categorías sin hijos) son las que reciben productos.
 *
 * Patrón: tras insertar cada nivel, se re-consulta la tabla completa para que
 * `id(nombre)` pueda resolver padres del nivel recién insertado.
 */

module.exports = {
  async up(queryInterface) {
    // Lookup mutable: se refresca después de cada bulkInsert.
    let cats = [];
    const id = (nombre) => {
      const cat = cats.find((c) => c.nombre === nombre);
      if (!cat) throw new Error(`[01-categoria] Categoría padre no encontrada: "${nombre}"`);
      return cat.id;
    };
    const refrescar = async () => {
      const [rows] = await queryInterface.sequelize.query('SELECT id, nombre FROM categorias');
      cats = rows;
    };

    // ── Nivel 0 — Raíces ────────────────────────────────────────────────────
    await queryInterface.bulkInsert('categorias', [
      { nombre: 'Componentes', padreId: null },
      { nombre: 'Periféricos', padreId: null },
    ], {});
    await refrescar();

    // ── Nivel 1 — Familias de componentes y periféricos ─────────────────────
    await queryInterface.bulkInsert('categorias', [
      { nombre: 'Procesador', padreId: id('Componentes') },
      { nombre: 'Motherboard', padreId: id('Componentes') },
      { nombre: 'Memoria RAM', padreId: id('Componentes') },
      { nombre: 'Placa de Video', padreId: id('Componentes') },
      { nombre: 'Almacenamiento', padreId: id('Componentes') },
      { nombre: 'Fuente de Poder', padreId: id('Componentes') },
      { nombre: 'Gabinete', padreId: id('Componentes') },
      { nombre: 'Monitor', padreId: id('Componentes') },
      { nombre: 'Placa de Red', padreId: id('Componentes') },
      { nombre: 'Placa de Bluetooth', padreId: id('Componentes') },
      { nombre: 'Refrigeración', padreId: id('Componentes') },
      { nombre: 'Teclado', padreId: id('Periféricos') },
      { nombre: 'Mouse', padreId: id('Periféricos') },
      { nombre: 'Auriculares', padreId: id('Periféricos') },
      { nombre: 'Mousepad', padreId: id('Periféricos') },
    ], {});
    await refrescar();

    // ── Nivel 2 — Marcas / tecnologías por familia ──────────────────────────
    // Procesador
    await queryInterface.bulkInsert('categorias', [
      { nombre: 'Procesador AMD', padreId: id('Procesador') },
      { nombre: 'Procesador Intel', padreId: id('Procesador') },
    ], {});
    // Motherboard
    await queryInterface.bulkInsert('categorias', [
      { nombre: 'Motherboard AMD', padreId: id('Motherboard') },
      { nombre: 'Motherboard Intel', padreId: id('Motherboard') },
    ], {});
    // Memoria RAM (estas son hojas: DDR5/DDR4/DDR3 directo bajo Memoria RAM)
    await queryInterface.bulkInsert('categorias', [
      { nombre: 'Memoria RAM DDR5', padreId: id('Memoria RAM') },
      { nombre: 'Memoria RAM DDR4', padreId: id('Memoria RAM') },
      { nombre: 'Memoria RAM DDR3', padreId: id('Memoria RAM') },
    ], {});
    // Placa de Video (hojas directas)
    await queryInterface.bulkInsert('categorias', [
      { nombre: 'Placa de Video NVIDIA', padreId: id('Placa de Video') },
      { nombre: 'Placa de Video AMD', padreId: id('Placa de Video') },
      { nombre: 'Placa de Video Intel', padreId: id('Placa de Video') },
    ], {});
    // Almacenamiento
    await queryInterface.bulkInsert('categorias', [
      { nombre: 'Almacenamiento SSD', padreId: id('Almacenamiento') },
      { nombre: 'Almacenamiento HDD', padreId: id('Almacenamiento') },
    ], {});
    // Fuente de Poder (hojas directas)
    await queryInterface.bulkInsert('categorias', [
      { nombre: 'Fuente de Poder Certificada', padreId: id('Fuente de Poder') },
      { nombre: 'Fuente de Poder Genérica', padreId: id('Fuente de Poder') },
    ], {});
    // Refrigeración (hojas directas)
    await queryInterface.bulkInsert('categorias', [
      { nombre: 'Refrigeración Líquida', padreId: id('Refrigeración') },
      { nombre: 'Refrigeración por Aire', padreId: id('Refrigeración') },
    ], {});
    // Gabinete (hojas directas)
    await queryInterface.bulkInsert('categorias', [
      { nombre: 'Gabinete Full-Tower', padreId: id('Gabinete') },
      { nombre: 'Gabinete Mid-Tower', padreId: id('Gabinete') },
      { nombre: 'Gabinete Mini-Tower', padreId: id('Gabinete') },
    ], {});
    // Monitor (hojas directas)
    await queryInterface.bulkInsert('categorias', [
      { nombre: 'Monitor Gamer', padreId: id('Monitor') },
      { nombre: 'Monitor de Oficina', padreId: id('Monitor') },
    ], {});
    // Teclado (hojas directas)
    await queryInterface.bulkInsert('categorias', [
      { nombre: 'Teclado Gamer', padreId: id('Teclado') },
      { nombre: 'Teclado de Oficina', padreId: id('Teclado') },
    ], {});
    // Mouse (hojas directas)
    await queryInterface.bulkInsert('categorias', [
      { nombre: 'Mouse Gamer', padreId: id('Mouse') },
      { nombre: 'Mouse de Oficina', padreId: id('Mouse') },
    ], {});
    // Auriculares (hojas directas)
    await queryInterface.bulkInsert('categorias', [
      { nombre: 'Auriculares Gamer', padreId: id('Auriculares') },
      { nombre: 'Auriculares de Oficina', padreId: id('Auriculares') },
    ], {});
    // Placa de Red (hojas directas)
    await queryInterface.bulkInsert('categorias', [
      { nombre: 'Placa de Red PCIe', padreId: id('Placa de Red') },
      { nombre: 'Placa de Red USB', padreId: id('Placa de Red') },
    ], {});
    // Placa de Bluetooth (hojas directas)
    await queryInterface.bulkInsert('categorias', [
      { nombre: 'Placa de Bluetooth PCIe', padreId: id('Placa de Bluetooth') },
      { nombre: 'Placa de Bluetooth USB', padreId: id('Placa de Bluetooth') },
    ], {});
    // Mousepad (hojas directas)
    await queryInterface.bulkInsert('categorias', [
      { nombre: 'Mousepad Gamer', padreId: id('Mousepad') },
      { nombre: 'Mousepad de Oficina', padreId: id('Mousepad') },
    ], {});
    await refrescar();

    // ── Nivel 3 — Sockets / subtipos (hojas finas) ──────────────────────────
    // Procesador → socket
    await queryInterface.bulkInsert('categorias', [
      { nombre: 'Procesador AMD AM5', padreId: id('Procesador AMD') },
      { nombre: 'Procesador AMD AM4', padreId: id('Procesador AMD') },
      { nombre: 'Procesador AMD AM3', padreId: id('Procesador AMD') },
      { nombre: 'Procesador Intel LGA 1851', padreId: id('Procesador Intel') },
      { nombre: 'Procesador Intel LGA 1700', padreId: id('Procesador Intel') },
      { nombre: 'Procesador Intel LGA 1200', padreId: id('Procesador Intel') },
      { nombre: 'Procesador Intel LGA 1151', padreId: id('Procesador Intel') },
    ], {});
    // Motherboard → socket
    await queryInterface.bulkInsert('categorias', [
      { nombre: 'Motherboard AMD AM5', padreId: id('Motherboard AMD') },
      { nombre: 'Motherboard AMD AM4', padreId: id('Motherboard AMD') },
      { nombre: 'Motherboard AMD AM3', padreId: id('Motherboard AMD') },
      { nombre: 'Motherboard Intel LGA 1851', padreId: id('Motherboard Intel') },
      { nombre: 'Motherboard Intel LGA 1700', padreId: id('Motherboard Intel') },
      { nombre: 'Motherboard Intel LGA 1200', padreId: id('Motherboard Intel') },
      { nombre: 'Motherboard Intel LGA 1151', padreId: id('Motherboard Intel') },
    ], {});
    // Almacenamiento → SSD M.2
    await queryInterface.bulkInsert('categorias', [
      { nombre: 'Almacenamiento SSD M.2', padreId: id('Almacenamiento SSD') },
    ], {});
    await refrescar();
    // Teclado → Wireless | Con Cable
    await queryInterface.bulkInsert('categorias', [
      { nombre: 'Teclado Gamer Wireless', padreId: id('Teclado Gamer') },
      { nombre: 'Teclado Gamer Con Cable', padreId: id('Teclado Gamer') },
      { nombre: 'Teclado de Oficina Wireless', padreId: id('Teclado de Oficina') },
      { nombre: 'Teclado de Oficina Con Cable', padreId: id('Teclado de Oficina') },
    ], {});
    // Mouse → Wireless | Con Cable
    await queryInterface.bulkInsert('categorias', [
      { nombre: 'Mouse Gamer Wireless', padreId: id('Mouse Gamer') },
      { nombre: 'Mouse Gamer Con Cable', padreId: id('Mouse Gamer') },
      { nombre: 'Mouse de Oficina Wireless', padreId: id('Mouse de Oficina') },
      { nombre: 'Mouse de Oficina Con Cable', padreId: id('Mouse de Oficina') },
    ], {});
    // Auriculares → Wireless | Con Cable
    await queryInterface.bulkInsert('categorias', [
      { nombre: 'Auriculares Gamer Wireless', padreId: id('Auriculares Gamer') },
      { nombre: 'Auriculares Gamer Con Cable', padreId: id('Auriculares Gamer') },
      { nombre: 'Auriculares de Oficina Wireless', padreId: id('Auriculares de Oficina') },
      { nombre: 'Auriculares de Oficina Con Cable', padreId: id('Auriculares de Oficina') },
    ], {});
    await refrescar();

    // ── Nivel 4 ───────────────────────────────────────────────────
    await queryInterface.bulkInsert('categorias', [
      { nombre: 'Almacenamiento SSD M.2 NVME', padreId: id('Almacenamiento SSD M.2') },
      { nombre: 'Almacenamiento SSD M.2 SATA', padreId: id('Almacenamiento SSD M.2') },
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('categorias', null, {});
  },
};
