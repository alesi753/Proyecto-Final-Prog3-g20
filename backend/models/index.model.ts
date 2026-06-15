// Archivo: backend/models/index.ts 
// Se encarga de configurar la conexión a la base de datos utilizando Sequelize y exportar el objeto sequelize para su uso en otros módulos.

import { Sequelize } from 'sequelize';
const config = require('../config/database.config');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Crear instancia de Sequelize con la configuración a la base de datos
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    dialectOptions: dbConfig.dialectOptions
  }
);



const verificarConexion = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log(`Conectado con exito a la base de datos en: ${dbConfig.host}`);
  } catch (error: any) {
    console.error('Error al conectar a la base de datos:', error.message);
  }
};

verificarConexion();

export { sequelize, Sequelize };