const { Router } = require('express');
const { OrdenController } = require('../controllers/orden.controller');
const { AuthMiddleware } = require('../middleware/auth.middleware');

const router = Router();

// Todo orden requiere token
router.use(AuthMiddleware.verificarToken);

// POST /api/ordenes/checkout
router.post('/checkout', OrdenController.procesarCheckout);

// GET /api/ordenes/historial
router.get('/historial', OrdenController.obtenerHistorialOrdenes);

module.exports = router;
