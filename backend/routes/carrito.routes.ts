import { Router } from 'express';
import { obtenerCarrito, agregarItem, eliminarItem } from '../controllers/carrito.controller';
import { verificarToken } from '../middleware/auth';

const router: Router = Router();

// Middleware de seguridad aplicado a todas las rutas de este bloque
router.use(verificarToken);

// [GET] Leer el estado actual del carrito
router.get('/', obtenerCarrito);

// [POST] Inyectar un producto al carrito
router.post('/agregar', agregarItem);

// [DELETE] Purgar un producto específico por ID
router.delete('/remover/:productoId', eliminarItem);

export default router;