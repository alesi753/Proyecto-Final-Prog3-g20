import { Request, Response } from 'express';
import { CategoriaModel } from '../models/categoria.model';
import { ProductoModel } from '../models/producto.model';

export class CategoriaController {
  // Obtiene todas las categorías
  static async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const categorias = await CategoriaModel.findAllCategories();

      res.status(200).json(categorias);
    } catch (error) {
      console.error('Error al obtener las categorías:', error);
      res.status(500).json({
        message: 'Error interno al obtener las categorías.',
      });
    }
  }

  // Obtiene una categoría por su id
  // Se asume que el middleware validateCategoryId ya validó req.params.id
  static async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const categoria = await CategoriaModel.findCategoryById(id);

      if (!categoria) {
        res.status(404).json({
          message: 'Categoría no encontrada.',
        });
        return;
      }

      res.status(200).json(categoria);
    } catch (error) {
      console.error('Error al obtener la categoría:', error);
      res.status(500).json({
        message: 'Error interno al obtener la categoría.',
      });
    }
  }

  // Crea una nueva categoría
  // Se asume que el middleware validateCreateCategory ya validó y normalizó el body
  static async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const nuevaCategoria = await CategoriaModel.createCategory(req.body);

      res.status(201).json({
        message: 'Categoría creada con éxito.',
        data: nuevaCategoria,
      });
    } catch (error) {
      console.error('Error al crear la categoría:', error);
      res.status(500).json({
        message: 'Error interno al crear la categoría.',
      });
    }
  }

  // Actualiza una categoría existente
  // Se asume que validateCategoryId y validateUpdateCategory ya validaron los datos
  static async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const categoriaActualizada = await CategoriaModel.updateCategory(
        id,
        req.body
      );

      if (!categoriaActualizada) {
        res.status(404).json({
          message: 'La categoría que intentas actualizar no existe.',
        });
        return;
      }

      res.status(200).json({
        message: 'Categoría actualizada con éxito.',
        data: categoriaActualizada,
      });
    } catch (error) {
      console.error('Error al actualizar la categoría:', error);
      res.status(500).json({
        message: 'Error interno al actualizar la categoría.',
      });
    }
  }

  // Elimina una categoría por su id
  // Se asume que validateCategoryId ya validó req.params.id
  static async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      // Primero verificamos si la categoría existe
      const categoria = await CategoriaModel.findCategoryById(id);

      if (!categoria) {
        res.status(404).json({
          message: 'La categoría que intentas eliminar no existe.',
        });
        return;
      }

      // Verificamos si tiene productos asociados antes de eliminarla
      const productosAsociados = await ProductoModel.count({
        where: { categoriaId: id },
      });

      if (productosAsociados > 0) {
        res.status(409).json({
          message:
            'No se puede eliminar la categoría porque tiene productos asociados.',
        });
        return;
      }

      // Si existe y no tiene productos asociados, la eliminamos
      const eliminada = await CategoriaModel.deleteCategory(id);

      if (!eliminada) {
        res.status(500).json({
          message: 'No se pudo eliminar la categoría.',
        });
        return;
      }

      res.status(200).json({
        message: 'Categoría eliminada con éxito.',
      });
    } catch (error) {
      console.error('Error al eliminar la categoría:', error);
      res.status(500).json({
        message: 'Error interno al eliminar la categoría.',
      });
    }
  }
}
