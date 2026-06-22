const { Router } = require('express');
const { ProductoController } = require('../controllers/producto.controller');
const { AuthMiddleware } = require('../middleware/auth.middleware');
const { ProductoMiddleware } = require('../middleware/producto.middleware');

const router = Router();

// Público
router.get('/', ProductoController.getAllProducts);
router.get(
  '/:id',
  ProductoMiddleware.validateProductId,
  ProductoController.getProductById
);

// Protegido
router.post(
  '/',
  AuthMiddleware.verificarToken,
  ProductoMiddleware.validateCreateProduct,
  ProductoController.createProduct
);
router.put(
  '/:id',
  AuthMiddleware.verificarToken,
  ProductoMiddleware.validateProductId,
  ProductoMiddleware.validateUpdateProduct,
  ProductoController.updateProduct
);
router.delete(
  '/:id',
  AuthMiddleware.verificarToken,
  ProductoMiddleware.validateProductId,
  ProductoController.deleteProduct
);

module.exports = router;
