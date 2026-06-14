// Archivo: backend/models/index.ts 
// Se encarga de configurar la conexión a la base de datos utilizando Sequelize y exportar el objeto sequelize para su uso en otros módulos.

import { Sequelize, DataTypes } from 'sequelize';
const config = require('../config/database.config');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

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

// Objeto contenedor para tus modelos
const db: any = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Inicialización de modelos (Asegurar de que estos archivos existan en la carpeta models/)
db.User = require('./User')(sequelize, DataTypes);
// db.Producto = require('./Producto')(sequelize, DataTypes);
// db.Categoria = require('./Categoria')(sequelize, DataTypes);
// db.Carrito = require('./Carrito')(sequelize, DataTypes);
// db.CarritoItem = require('./Carrito_Item')(sequelize, DataTypes);
// db.Orden = require('./Orden')(sequelize, DataTypes);
// db.OrdenItem = require('./Orden_Item')(sequelize, DataTypes);



const verificarConexion = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log(`Conectado con exito a la base de datos en: ${dbConfig.host}`);
  } catch (error: any) {
    console.error('Error al conectar a la base de datos:', error.message);
  }
};

verificarConexion();

export default db;