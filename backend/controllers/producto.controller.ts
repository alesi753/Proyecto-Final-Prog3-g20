import { Request, Response } from "express";
import { ProductoModel } from "../models/producto.model";
import { CarritoItemModel } from "../models/carrito-item.model";
import { OrderItemModel } from "../models/orden-item.model";
import { CategoriaModel } from "../models/categoria.model";
import { MarcaModel } from "../models/marca.model";

export class ProductoController {
  // Obtiene todos los productos
  static async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const productos = await ProductoModel.findAllProducts();

      res.status(200).json(productos);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      res.status(500).json({
        message: "Error interno al obtener los productos.",
      });
    }
  }

  // Obtiene un producto por su id
  // Se asume que validateProductId ya validó req.params.id
  static async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const producto = await ProductoModel.findProductById(id);

      if (!producto) {
        res.status(404).json({
          message: "Producto no encontrado.",
        });
        return;
      }

      res.status(200).json(producto);
    } catch (error) {
      console.error("Error al obtener el producto:", error);
      res.status(500).json({
        message: "Error interno al obtener el producto.",
      });
    }
  }

  // Crea un nuevo producto
  // Se asume que validateCreateProduct ya validó y normalizó el body
  static async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const { categoriaId, marcaId } = req.body;

      // Verificamos que la categoría exista
      const categoria = await CategoriaModel.findCategoryById(categoriaId);

      if (!categoria) {
        res.status(404).json({
          message: "La categoría especificada no existe.",
        });
        return;
      }

      // Verificamos que la marca exista
      const marca = await MarcaModel.findMarcaById(marcaId);

      if (!marca) {
        res.status(404).json({
          message: "La marca especificada no existe.",
        });
        return;
      }

      // Si categoría y marca existen, creamos el producto
      const nuevoProducto = await ProductoModel.createProduct(req.body);

      res.status(201).json({
        message: "Producto creado con éxito.",
        data: nuevoProducto,
      });
    } catch (error) {
      console.error("Error al crear el producto:", error);
      res.status(500).json({
        message: "Error interno al crear el producto.",
      });
    }
  }

  // Actualiza un producto existente
  // Se asume que validateProductId y validateUpdateProduct ya validaron los datos
  static async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      // Verificamos si el producto existe
      const producto = await ProductoModel.findProductById(id);

      if (!producto) {
        res.status(404).json({
          message: "El producto que intentas actualizar no existe.",
        });
        return;
      }

      // Si envían categoriaId, verificamos que la categoría exista
      if (req.body.categoriaId !== undefined) {
        const categoria = await CategoriaModel.findCategoryById(
          req.body.categoriaId,
        );

        if (!categoria) {
          res.status(404).json({
            message: "La categoría especificada no existe.",
          });
          return;
        }
      }

      // Si envían marcaId, verificamos que la marca exista
      if (req.body.marcaId !== undefined) {
        const marca = await MarcaModel.findMarcaById(req.body.marcaId);

        if (!marca) {
          res.status(404).json({
            message: "La marca especificada no existe.",
          });
          return;
        }
      }

      // Si todo es válido, actualizamos el producto
      const productoActualizado = await ProductoModel.updateProduct(
        id,
        req.body,
      );

      res.status(200).json({
        message: "Producto actualizado con éxito.",
        data: productoActualizado,
      });
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      res.status(500).json({
        message: "Error interno al actualizar el producto.",
      });
    }
  }

  // Elimina un producto por su id
  // Se asume que validateProductId ya validó req.params.id
  static async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      // Verificamos si el producto existe
      const producto = await ProductoModel.findProductById(id);

      if (!producto) {
        res.status(404).json({
          message: "El producto que intentas eliminar no existe.",
        });
        return;
      }

      // Verificamos si el producto está asociado a algún carrito
      const carritosAsociados = await CarritoItemModel.count({
        where: { productoId: id },
      });

      if (carritosAsociados > 0) {
        res.status(409).json({
          message:
            "No se puede eliminar el producto porque está asociado a un carrito.",
        });
        return;
      }

      // Verificamos si el producto está asociado a alguna orden
      const ordenesAsociadas = await OrderItemModel.count({
        where: { productoId: id },
      });

      if (ordenesAsociadas > 0) {
        res.status(409).json({
          message:
            "No se puede eliminar el producto porque está asociado a una orden.",
        });
        return;
      }

      // Si existe y no tiene relaciones, lo eliminamos
      const eliminado = await ProductoModel.deleteProduct(id);

      res.status(200).json({
        message: "Producto eliminado con éxito.",
        data: eliminado,
      });
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      res.status(500).json({
        message: "Error interno al eliminar el producto.",
      });
    }
  }
}
