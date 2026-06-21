'use strict';

/**
 * Seeder: Marcas de hardware (lista plana).
 * Orden: 02 (corre después de categorías, antes de productos).
 *
 * La tabla `marcas` solo tiene id + nombre (unique). La relación marca↔producto
 * la resuelve el producto vía marcaId; acá no hay vínculo a categoría.
 *
 * Los comentarios agrupan por rubro solo como referencia de lectura — muchas
 * marcas son multi-rubro (ASUS, Corsair, MSI...) y por eso aparecen una sola vez.
 * `nombre` es unique: no repetir.
 */

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('marcas', [
      // CPU / GPU
      { nombre: 'AMD' },
      { nombre: 'Intel' },
      { nombre: 'NVIDIA' },

      // Motherboards / GPUs / monitores
      { nombre: 'ASUS' },
      { nombre: 'Gigabyte' },
      { nombre: 'MSI' },
      { nombre: 'ASRock' },
      { nombre: 'Biostar' },
      { nombre: 'EVGA' },
      { nombre: 'Zotac' },
      { nombre: 'Sapphire' },

      // Memoria RAM / almacenamiento
      { nombre: 'Corsair' },
      { nombre: 'Kingston' },
      { nombre: 'Crucial' },
      { nombre: 'G.Skill' },
      { nombre: 'ADATA' },
      { nombre: 'Samsung' },
      { nombre: 'Western Digital' },
      { nombre: 'Seagate' },

      // Fuentes / gabinetes / refrigeración
      { nombre: 'Seasonic' },
      { nombre: 'Thermaltake' },
      { nombre: 'Cooler Master' },
      { nombre: 'NZXT' },
      { nombre: 'be quiet!' },
      { nombre: 'Noctua' },
      { nombre: 'Lian Li' },
      { nombre: 'Deepcool' },

      // Monitores
      { nombre: 'LG' },
      { nombre: 'Acer' },
      { nombre: 'AOC' },
      { nombre: 'BenQ' },
      { nombre: 'ViewSonic' },

      // Periféricos
      { nombre: 'Logitech' },
      { nombre: 'Razer' },
      { nombre: 'HyperX' },
      { nombre: 'SteelSeries' },
      { nombre: 'Redragon' },

      // Conectividad
      { nombre: 'TP-Link' },
      { nombre: 'Realtek' },
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('marcas', null, {});
  },
};
