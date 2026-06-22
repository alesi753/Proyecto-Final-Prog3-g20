const { Router } = require('express');
const { OrdenController } = require('../controllers/orden.controller');
const { AuthMiddleware } = require('../middleware/auth.middleware');
const { RoleMiddleware } = require('../middleware/role.middleware'); 

const router = Router();

// Todo orden requiere token válido, así que aplicamos el middleware de autenticación a todo el router.
router.use(AuthMiddleware.verificarToken);

// POST /api/ordenes/checkout
router.post('/checkout', OrdenController.procesarCheckout);

// GET /api/ordenes/historial (Para clientes normales)
router.get('/historial', OrdenController.obtenerHistorialOrdenes);

// GET /api/ordenes/admin/todas (Solo para administradores)

router.get(
  '/admin/todas', 
  RoleMiddleware.verificarRol('admin'), 
  OrdenController.obtenerTodasLasOrdenesAdmin
);

module.exports = router;