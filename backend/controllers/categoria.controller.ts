import { Request, Response } from 'express';
import { CategoriaModel } from '../models/categoria.model';

export class CategoriaController {
  
  static async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const categorias = await CategoriaModel.findAllCategories();
      res.json(categorias);
    } catch (error) {
      console.error('Error al obtener las categorías:', error);
      res.status(500).json({ message: 'Error al obtener las categorías' });
    }
  }
  
  static async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10); 
      
      const categoria = await CategoriaModel.findCategoryById(id);
      if (!categoria) {
        res.status(404).json({ message: 'Categoría no encontrada' });
        return;
      }

      res.json(categoria);

    } catch (error) {
      console.error('Error al obtener la categoría:', error);
      res.status(500).json({ message: 'Error al obtener la categoría' });
    }
  }

  static async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const nuevaCategoria = await CategoriaModel.createCategory(req.body);
      res.status(201).json(nuevaCategoria);
    } catch (error) {
      console.error('Error al crear la categoría:', error);
      res.status(500).json({ message: 'Error al crear la categoría' });
    }
  }

  static async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      const categoriaActualizada = await CategoriaModel.updateCategory(id, req.body);

      if (!categoriaActualizada) {
        res.status(404).json({ message: 'La categoría que intentas actualizar no existe' });
        return;
      }

      res.json(categoriaActualizada);
    } catch (error) {
      console.error('Error al actualizar la categoría:', error);
      res.status(500).json({ message: 'Error interno al actualizar la categoría' });
    }
  }

  static async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      
      const categoria = await CategoriaModel.deleteCategory(id);
      if (!categoria) {
        res.status(404).json({ message: 'La categoría que intentas eliminar no existe' });
        return;
      }

      res.json({ message: 'Categoría eliminada con éxito'});
    } catch (error) {
      console.error('Error al eliminar la categoría:', error);
      res.status(500).json({ message: 'Error interno al eliminar la categoría' });
    }
  }

}