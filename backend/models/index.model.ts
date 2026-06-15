import { Sequelize } from 'sequelize';
const dbConfig = require('../config/database.config');

const env = process.env.NODE_ENV || 'development';
const envConfig = dbConfig[env];

// Neon (and other cloud DBs) supply DATABASE_URL as a full connection URI.
// When present it takes precedence over the individual DB_* vars.
const sequelize: Sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
      pool: { max: 3, min: 0, acquire: 60000, idle: 10000 }
    })
  : new Sequelize(
      envConfig.database,
      envConfig.username,
      envConfig.password,
      {
        host: envConfig.host,
        port: envConfig.port,
        dialect: 'postgres',
        logging: envConfig.logging,
        pool: envConfig.pool,
        dialectOptions: envConfig.dialectOptions
      }
    );

// Export sequelize BEFORE loading models.
// Each model file does `import { sequelize } from './index.model'`, so
// exports.sequelize must be set in the cached module before those files run.
// Using `export const X = require(...)` (not ES `import`) keeps the require
// calls in-place in the compiled JS, after the export above.
export { sequelize, Sequelize };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const User: any        = require('./usuario.model').UsuarioModel;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Producto: any    = require('./producto.model').ProductoModel;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Carrito: any     = require('./carrito.model').CarritoModel;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CarritoItem: any = require('./carrito-item.model').CarritoItemModel;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Orden: any       = require('./orden.model').OrdenModel;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const OrdenItem: any   = require('./orden-item.model').OrderItemModel;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Categoria: any   = require('./categoria.model').CategoriaModel;

// Wire all associations after every model is registered
require('./cardinalidades.model').configurarCardinalidades();
