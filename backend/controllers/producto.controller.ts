import { Request, Response } from 'express';
import { ProductoModel } from '../models/producto.model';

export class ProductoController {
  
  static async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const productos = await ProductoModel.findAllProducts();
      res.json(productos);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      res.status(500).json({ message: 'Error al obtener los productos' });
    }
  }

  static async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      const producto = await ProductoModel.findProductById(id);
      if (!producto) {
        res.status(404).json({ message: 'Producto no encontrado' });
        return;
      }
      res.json(producto);
    } catch (error) {
      console.error('Error al obtener el producto:', error);
      res.status(500).json({ message: 'Error al obtener el producto' });
    }
  }
  
  static async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const nuevoProducto = await ProductoModel.createProduct(req.body);
      res.status(201).json(nuevoProducto);
    } catch (error) {
      console.error('Error al crear el producto:', error);
      res.status(500).json({ message: 'Error al crear el producto' });
    }
  }

  static async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      const productoActualizado = await ProductoModel.updateProduct(id, req.body);
      if (!productoActualizado) {
        res.status(404).json({ message: 'El producto que intentas actualizar no existe' });
        return;
      }
      res.json(productoActualizado);
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      res.status(500).json({ message: 'Error interno al actualizar el producto' });
    }
  }

  static async disableProduct(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      const deshabilitado = await ProductoModel.disableProduct(id);
      if (!deshabilitado) {
        res.status(404).json({ message: 'El producto que intentas deshabilitar no existe o ya está deshabilitado' });
        return;
      }
      res.json(deshabilitado);
    } catch (error) {
      console.error('Error al deshabilitar el producto:', error);
      res.status(500).json({ message: 'Error interno al deshabilitar el producto' });
    }
  }

  static async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      const eliminado = await ProductoModel.deleteProduct(id);
      if (!eliminado) {
        res.status(404).json({ message: 'El producto que intentas eliminar no existe' });
        return;
      }
      res.json(eliminado);
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      res.status(500).json({ message: 'Error interno al eliminar el producto' });
    }
  }
  
}