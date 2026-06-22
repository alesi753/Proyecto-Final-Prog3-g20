const { Router } = require('express');
const { AuthController } = require('../controllers/auth.controller');
const { AuthMiddleware } = require('../middleware/auth.middleware');

const router = Router();

// POST /api/auth/register
router.post('/register', AuthController.register);

// POST /api/auth/login
router.post('/login', AuthController.login);

// GET /api/auth/perfil
router.get('/perfil', AuthMiddleware.verificarToken, AuthController.perfil);

module.exports = router;
