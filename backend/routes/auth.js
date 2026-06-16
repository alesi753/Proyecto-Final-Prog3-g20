const express = require('express');
const router = express.Router();
const { AuthController } = require('../controllers/auth.controller');
const { AuthMiddleware } = require('../middleware/auth.middleware');

// POST /api/auth/register - Registro de usuario (pública)
router.post('/register', AuthController.register);

// POST /api/auth/login - Inicio de sesión (pública)
router.post('/login', AuthController.login);

// GET /api/auth/perfil - Obtener perfil (protegida)
router.get('/perfil', AuthMiddleware.verificarToken, AuthController.perfil);

module.exports = router;
