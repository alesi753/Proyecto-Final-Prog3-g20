const { Router } = require('express');
const { obtenerCarrito, agregarItem, eliminarItem } = require('../controllers/carrito.controller');
const { verificarToken } = require('../middleware/auth.middleware');

const router = Router();

// Endpoint bloqueado: Todo require validación de token JWT
router.use(verificarToken);

// [GET] Leer la memoria actual del carrito
router.get('/', obtenerCarrito);

// [POST] Inyectar hardware al carrito
router.post('/agregar', agregarItem);

// [DELETE] Purgar un hardware específico
router.delete('/remover/:productoId', eliminarItem);

module.exports = router;