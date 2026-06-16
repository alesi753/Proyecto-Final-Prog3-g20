const { Router } = require('express');
const { crearCategoria, obtenerCategorias } = require('../controllers/categoria.controller');
const { verificarToken } = require('../middleware/auth.middleware');

const router = Router();

// [GET] Lectura pública del mapa de categorías
router.get('/', obtenerCategorias);

// [POST] Escritura restringida al administrador/sistema
router.post('/', verificarToken, crearCategoria);

module.exports = router;