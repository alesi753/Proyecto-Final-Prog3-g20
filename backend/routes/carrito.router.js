const { Router } = require('express');
const { CarritoController } = require('../controllers/carrito.controller');
const { AuthMiddleware } = require('../middleware/auth.middleware');
const { CarritoMiddleware } = require('../middleware/carrito.middleware');

const router = Router();

// Todo carrito requiere token
router.use(AuthMiddleware.verificarToken);

// GET /api/carrito
router.get('/', CarritoController.obtenerCarrito);

// POST /api/carrito/agregar
router.post(
  '/agregar',
  CarritoMiddleware.validateAgregarItem,
  CarritoController.agregarItem
);

// DELETE /api/carrito/remover/:productoId
router.delete(
  '/remover/:productoId',
  CarritoMiddleware.validateProductoIdParam,
  CarritoController.eliminarItem
);

module.exports = router;
