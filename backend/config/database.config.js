require('dotenv').config();

/**
 * Config de base de datos — consumido tanto por la app como por Sequelize-CLI.
 *
 * IMPORTANTE: la app (index.model.js) se conecta con DATABASE_URL (la connection
 * string completa de Neon). Para que la CLI use la MISMA conexión, cada entorno
 * expone `url: process.env.DATABASE_URL`. Sequelize-CLI, si encuentra `url`, la
 * usa directamente e ignora username/host/etc. Así un solo .env (con DATABASE_URL)
 * alcanza para correr seeders y migraciones contra Neon.
 *
 * Las variables DB_* separadas quedan como fallback para un Postgres local clásico.
 */

module.exports = {
  development: {
    url: process.env.DATABASE_URL,            // ← Neon (si está definida, manda)
    username: process.env.DB_USER || 'app_user',
    password: process.env.DB_PASSWORD || 'app_password',
    database: process.env.DB_NAME || 'app_database',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
    logging: console.log,
    // Neon exige SSL. No molesta a un Postgres local si DATABASE_URL no está seteada
    // y te conectás por host local (en ese caso podés bajar esto a {}).
    dialectOptions: process.env.DATABASE_URL
      ? { ssl: { require: true, rejectUnauthorized: false } }
      : {},
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
  },
  production: {
    url: process.env.DATABASE_URL,            // ← Neon
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
    },
    pool: { max: 3, min: 0, acquire: 60000, idle: 10000 },
  },
};
