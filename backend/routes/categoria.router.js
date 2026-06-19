const { Router } = require('express');
const { CategoriaController } = require('../controllers/categoria.controller');
const { AuthMiddleware } = require('../middleware/auth.middleware');
const { CategoriaMiddleware } = require('../middleware/categoria.middleware');

const router = Router();

// Público
router.get('/', CategoriaController.getAllCategories);
router.get('/:id', CategoriaMiddleware.validateCategoryId, CategoriaController.getCategoryById);

// Protegido
router.post('/', AuthMiddleware.verificarToken, CategoriaMiddleware.validateCreateCategory, CategoriaController.createCategory);
router.put('/:id', AuthMiddleware.verificarToken, CategoriaMiddleware.validateCategoryId, CategoriaMiddleware.validateUpdateCategory, CategoriaController.updateCategory);
router.delete('/:id', AuthMiddleware.verificarToken, CategoriaMiddleware.validateCategoryId, CategoriaController.deleteCategory);

module.exports = router;