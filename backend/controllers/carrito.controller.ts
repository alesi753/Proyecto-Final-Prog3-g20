import { Response } from "express";
import { CarritoModel } from "../models/carrito.model";
import { CarritoItem, Producto } from "../models/index.model";
import { AuthRequest } from "../middleware/auth.middleware";

export class CarritoController {
  // Obtiene el carrito del usuario autenticado
  // Se asume que AuthMiddleware ya validó el token
  static async obtenerCarrito(req: AuthRequest, res: Response): Promise<void> {
    try {
      // Verificamos que el usuario esté autenticado
      if (!req.user) {
        res.status(401).json({ message: "Usuario no autenticado." });
        return;
      }

      const usuarioId = req.user.id;

      // Buscamos el carrito del usuario
      let carrito = await CarritoModel.findCartByUserId(usuarioId);

      // Si no existe, lo creamos
      if (!carrito) {
        carrito = await CarritoModel.createCart({ usuarioId });
      }

      // Traemos el carrito con los productos asociados
      const carritoConProductos = await CarritoModel.findOne({
        where: { id: carrito.id },
        include: [
          {
            model: Producto,
            as: "productos",
            through: { attributes: ["cantidad"] },
          },
        ],
      });

      res.status(200).json(carritoConProductos);
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      res.status(500).json({
        message: "Error interno al obtener el carrito.",
      });
    }
  }

  // Agrega un producto al carrito del usuario
  // Se asume que validateAgregarItem ya validó productoId y cantidad
  static async agregarItem(req: AuthRequest, res: Response): Promise<void> {
    try {
      // Verificamos que el usuario esté autenticado
      if (!req.user) {
        res.status(401).json({ message: "Usuario no autenticado." });
        return;
      }

      const usuarioId = req.user.id;
      const { productoId, cantidad } = req.body;

      // Verificamos que el producto exista
      const producto: any = await Producto.findByPk(productoId);

      if (!producto) {
        res.status(404).json({ message: "Producto no encontrado." });
        return;
      }

      // Verificamos que haya stock suficiente
      if (producto.stock < cantidad) {
        res.status(409).json({
          message: `Stock insuficiente. Disponible: ${producto.stock}.`,
        });
        return;
      }

      // Buscamos o creamos el carrito del usuario
      let carrito = await CarritoModel.findCartByUserId(usuarioId);

      if (!carrito) {
        carrito = await CarritoModel.createCart({ usuarioId });
      }

      // Verificamos si el producto ya está en el carrito
      const itemExistente: any = await CarritoItem.findOne({
        where: { carritoId: carrito.id, productoId },
      });

      // Si ya existe, actualizamos la cantidad
      if (itemExistente) {
        const nuevaCantidad = itemExistente.cantidad + cantidad;

        // Validamos que la nueva cantidad no supere el stock
        if (producto.stock < nuevaCantidad) {
          res.status(409).json({
            message: "La cantidad total solicitada supera el stock disponible.",
          });
          return;
        }

        await itemExistente.update({ cantidad: nuevaCantidad });
      } else {
        // Si no existe, creamos un nuevo item en el carrito
        await CarritoItem.create({
          carritoId: carrito.id,
          productoId,
          cantidad,
        });
      }

      res.status(200).json({
        message: "Producto agregado al carrito con éxito.",
      });
    } catch (error) {
      console.error("Error al agregar item al carrito:", error);
      res.status(500).json({
        message: "Error interno al agregar el producto al carrito.",
      });
    }
  }

  // Elimina un producto del carrito del usuario
  // Se asume que validateProductoIdParam ya validó el productoId del parámetro
  static async eliminarItem(req: AuthRequest, res: Response): Promise<void> {
    try {
      // Verificamos que el usuario esté autenticado
      if (!req.user) {
        res.status(401).json({ message: "Usuario no autenticado." });
        return;
      }

      const usuarioId = req.user.id;
      const productoId = Number(req.params.productoId);

      // Buscamos el carrito del usuario
      const carrito = await CarritoModel.findCartByUserId(usuarioId);

      if (!carrito) {
        res.status(404).json({ message: "Carrito no encontrado." });
        return;
      }

      // Buscamos el item en el carrito
      const item = await CarritoItem.findOne({
        where: { carritoId: carrito.id, productoId },
      });

      if (!item) {
        res.status(404).json({
          message: "El producto no se encuentra en el carrito.",
        });
        return;
      }

      // Eliminamos el item del carrito
      await item.destroy();

      res.status(200).json({
        message: "Producto eliminado del carrito con éxito.",
      });
    } catch (error) {
      console.error("Error al eliminar item del carrito:", error);
      res.status(500).json({
        message: "Error interno al eliminar el producto del carrito.",
      });
    }
  }
}
