const { Router } = require('express');
const { 
  crearProducto, 
  obtenerProductosActivos, 
  actualizarProducto, 
  eliminarProductoLogico 
} = require('../controllers/producto.controller');

const { verificarToken } = require('../middleware/auth.middleware');

const router = Router();

// Endpoint público: Lectura del catálogo
router.get('/', obtenerProductosActivos);

// Endpoints protegidos: Modificación del disco
router.post('/', verificarToken, crearProducto);
router.put('/:id', verificarToken, actualizarProducto);
router.delete('/:id', verificarToken, eliminarProductoLogico);

module.exports = router;