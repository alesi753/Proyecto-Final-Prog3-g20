const { Router } = require('express');
const { OrdenController } = require('../controllers/orden.controller');
const { AuthMiddleware } = require('../middleware/auth.middleware');
const { RoleMiddleware } = require('../middleware/role.middleware');

const router = Router();

// Todo orden requiere token
router.use(AuthMiddleware.verificarToken);

// POST /api/ordenes/checkout
router.post('/checkout', OrdenController.procesarCheckout);

// GET /api/ordenes/historial
router.get('/historial', OrdenController.obtenerHistorialOrdenes);

// PUT /api/ordenes/admin/:id/estado
router.put('/admin/:id/estado',RoleMiddleware.authorize('admin'),OrdenController.actualizarEstadoOrden
);
module.exports = router;
