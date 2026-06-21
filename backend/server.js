'use strict';

// In development, register ts-node so that require() can load .ts model files.
// In production the Dockerfile runs `npx tsc` first, compiling all .ts → .js
// in-place, so ts-node is not needed at runtime.
if (process.env.NODE_ENV !== 'production') {
  require('ts-node').register({ transpileOnly: true });
}

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

// Sequelize instance + model registration (also calls configurarCardinalidades)
const { sequelize } = require('./models/index.model');

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api', require('./routes/index.router.js')); // Rutas /api/health y /api/test
app.use('/api/auth', require('./routes/auth.router.js'));
app.use('/api/marcas', require('./routes/marca.router.js'));
app.use('/api/categorias', require('./routes/categoria.router.js'));
app.use('/api/productos', require('./routes/producto.router.js'));
app.use('/api/usuarios', require('./routes/usuario.router.js'));
app.use('/api/carrito', require('./routes/carrito.router.js'));
app.use('/api/ordenes', require('./routes/orden.router.js'));

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado.' });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use(require('./middleware/error-handler.middleware'));

// ── Database + Server boot ────────────────────────────────────────────────────
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a PostgreSQL establecida.');

    // sync({ alter: false }) creates missing tables without dropping data.
    // For Neon on first deploy this bootstraps the schema from the models.
    await sequelize.sync({ alter: false });
    console.log('Modelos sincronizados con la base de datos.');

    app.listen(PORT, () => {
      console.log(
        `Servidor corriendo en el puerto ${PORT} [${process.env.NODE_ENV || 'development'}]`
      );
    });
  } catch (error) {
    console.error('Error fatal al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();

// ── Graceful shutdown ─────────────────────────────────────────────────────────
const shutdown = async (signal) => {
  console.log(`${signal} recibido. Cerrando servidor...`);
  try {
    await sequelize.close();
  } catch (err) {
    console.error('Error al cerrar la conexión:', err);
  }
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
