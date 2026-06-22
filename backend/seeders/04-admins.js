'use strict';
const bcrypt = require('bcryptjs'); 
module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordSegura = await bcrypt.hash('defensa123', 10);