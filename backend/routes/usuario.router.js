const { Router } = require('express');
const { UsuarioController } = require('../controllers/usuario.controller');
const { AuthMiddleware } = require('../middleware/auth.middleware');
const { RoleMiddleware } = require('../middleware/role.middleware');
const { UsuarioMiddleware } = require('../middleware/usuario.middleware');

const router = Router();

// Todo usuarios protegido
router.use(AuthMiddleware.verificarToken);

// Solo admin
router.get('/', RoleMiddleware.authorize('admin'), UsuarioController.getAllUsers);
router.get('/:id', RoleMiddleware.authorize('admin'), UsuarioMiddleware.validateUserId, UsuarioController.getUserById);
router.post('/', RoleMiddleware.authorize('admin'), UsuarioMiddleware.validateCreateUser, UsuarioController.createUser);
router.put('/:id', RoleMiddleware.authorize('admin'), UsuarioMiddleware.validateUserId, UsuarioMiddleware.validateUpdateUser, UsuarioController.updateUser);
router.delete('/:id', RoleMiddleware.authorize('admin'), UsuarioMiddleware.validateUserId, UsuarioController.deleteUser);

module.exports = router;