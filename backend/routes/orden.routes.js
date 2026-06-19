const { Router } = require('express');
const { procesarCheckout, obtenerHistorialOrdenes } = require('../controllers/orden.controller');
const { AuthMiddleware } = require('../middleware/auth.middleware');

const router = Router();

// Endpoint bloqueado: Seguridad estricta
router.use(AuthMiddleware.verificarToken);

// [POST] Ejecutar el motor de pago y vaciar carrito
router.post('/checkout', procesarCheckout);

// [GET] Leer el log histórico de compras del usuario
router.get('/historial', obtenerHistorialOrdenes);

module.exports = router;