'use strict';
const bcrypt = require('bcryptjs'); 
module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordSegura = await bcrypt.hash('defensa123', 10);
    await queryInterface.bulkInsert('usuarios', [
      {
        nombre: 'David',
        apellido: 'Admin',
        correo: 'david@admin.com',
        password: passwordSegura,
        rol: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Neman',
        apellido: 'Admin',
        correo: 'neman@admin.com',
        password: passwordSegura,
        rol: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Alejo',
        apellido: 'Admin',
        correo: 'alejo@admin.com',
        password: passwordSegura,
        rol: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Rama',
        apellido: 'Admin',
        correo: 'rama@admin.com',
        password: passwordSegura,
        rol: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    // Esto borra sus cuentas si alguna vez resetean los seeders
    await queryInterface.bulkDelete('usuarios', { 
      correo: [
        'david@admin.com', 
        'neman@admin.com', 
        'alejo@admin.com', 
        'rama@admin.com'
      ] 
    }, {});
  }
};