import { Router } from 'express';
import { crearCategoria, obtenerCategorias } from '../controllers/categoria.controller';
import { verificarToken } from '../middleware/auth';

const router: Router = Router();

// [GET] Lectura pública del mapa de categorías (Sin protección de token)
router.get('/', obtenerCategorias);

// [POST] Escritura restringida: Requiere validación de token JWT
router.post('/', verificarToken, crearCategoria);

export default router;