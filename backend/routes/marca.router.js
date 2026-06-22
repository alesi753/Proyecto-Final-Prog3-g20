const { Router } = require('express');
const { MarcaController } = require('../controllers/marca.controller');
const { AuthMiddleware } = require('../middleware/auth.middleware');
const { MarcaMiddleware } = require('../middleware/marca.middleware');

const router = Router();

// Público
router.get('/', MarcaController.getAllMarcas);
router.get(
  '/:id',
  MarcaMiddleware.validateMarcaId,
  MarcaController.getMarcaById
);

// Protegido
router.post(
  '/',
  AuthMiddleware.verificarToken,
  MarcaMiddleware.validateCreateMarca,
  MarcaController.createMarca
);
router.put(
  '/:id',
  AuthMiddleware.verificarToken,
  MarcaMiddleware.validateMarcaId,
  MarcaMiddleware.validateUpdateMarca,
  MarcaController.updateMarca
);
router.delete(
  '/:id',
  AuthMiddleware.verificarToken,
  MarcaMiddleware.validateMarcaId,
  MarcaController.deleteMarca
);

module.exports = router;
