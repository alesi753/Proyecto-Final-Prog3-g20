const { Router } = require('express');
const { CategoriaController } = require('../controllers/categoria.controller');
const { AuthMiddleware } = require('../middleware/auth.middleware');

const router = Router();

// [GET] Lectura pública del mapa de categorías
router.get('/', CategoriaController.getAllCategories);

// [POST] Escritura restringida al administrador/sistema
router.post('/', AuthMiddleware.verificarToken, CategoriaController.createCategory);

module.exports = router;