const { Router } = require('express');
const { ProductoController } = require('../controllers/producto.controller');

const { AuthMiddleware } = require('../middleware/auth.middleware');

const router = Router();

// Endpoint público: Lectura del catálogo
router.get('/', ProductoController.getAllProducts);

// Endpoints protegidos: Modificación del disco
router.post('/', AuthMiddleware.verificarToken, ProductoController.createProduct);
router.put('/:id', AuthMiddleware.verificarToken, ProductoController.updateProduct);
router.delete('/:id', AuthMiddleware.verificarToken, ProductoController.deleteProduct);

module.exports = router;