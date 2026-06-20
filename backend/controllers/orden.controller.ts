import { Response } from "express";
import { sequelize } from "../models/index.model";
import { OrdenModel } from "../models/orden.model";
import { OrderItemModel } from "../models/orden-item.model";
import { ProductoModel } from "../models/producto.model";
import { CarritoModel } from "../models/carrito.model";
import { CarritoItemModel } from "../models/carrito-item.model";
import { AuthRequest } from "../middleware/auth.middleware";

export class OrdenController {
  // Procesa la compra del usuario autenticado a partir de los productos que tiene en su carrito
  // Usa una transacción para asegurar que todos los cambios se realicen juntos o se reviertan si ocurre un error
  static async procesarCheckout(req: AuthRequest, res: Response) {
    // Verifica que haya un usuario autenticado antes de iniciar la transacción
    if (!req.user) {
      res.status(401).json({ message: "Acceso denegado." });
      return;
    }

    const t = await sequelize.transaction();

    try {
      const usuarioId = req.user.id;

      // Busca el carrito del usuario incluyendo los productos que contiene
      const carrito: any = await CarritoModel.findCartByUserIdWithProducts(
        usuarioId,
        t,
      );

      // Verifica que el carrito exista y tenga productos para comprar
      if (!carrito || !carrito.productos || carrito.productos.length === 0) {
        await t.rollback();
        res.status(400).json({ message: "El carrito está vacío." });
        return;
      }

      let totalOrden = 0;
      const itemsProcesados: {
        productoId: number;
        cantidad: number;
        precioAlComprar: number;
      }[] = [];

      // Recorre todos los productos que vienen dentro del carrito
      for (const producto of carrito.productos) {
        // Inicializa la cantidad en 0 por seguridad
        let cantidad = 0;

        // Toma la cantidad desde la tabla intermedia CarritoItemModel (relación N:M)
        // Si existe y no es null, la convierte a número
        if (
          (producto as any).CarritoItemModel &&
          (producto as any).CarritoItemModel.cantidad != null
        ) {
          cantidad = Number((producto as any).CarritoItemModel.cantidad);
        }

        // Inicializa el precio en 0
        let precio = 0;

        // Convierte el precio a número (DECIMAL suele venir como string en Sequelize)
        if (producto.precio != null) {
          precio = Number(producto.precio);
        }

        // Valida que la cantidad sea válida
        if (cantidad <= 0) {
          await t.rollback();
          res.status(400).json({
            message: `Cantidad inválida para el producto ${producto.modelo}.`,
          });
          return;
        }

        // Valida stock suficiente antes de permitir la compra
        if (producto.stock < cantidad) {
          await t.rollback();
          res.status(400).json({
            message: `No hay suficiente stock para el producto ${producto.modelo}.`,
          });
          return;
        }

        // Suma al total de la orden el subtotal de este producto
        // subtotal = precio * cantidad
        totalOrden += precio * cantidad;

        // Guarda este item para crear luego los registros de orden_item
        itemsProcesados.push({
          productoId: producto.id,
          cantidad: cantidad,
          precioAlComprar: precio,
        });
      }

      // Crea la orden con el total calculado y estado inicial pendiente
      const nuevaOrden = await OrdenModel.createOrder(
        {
          usuarioId,
          precioTotal: totalOrden,
          estado: "pendiente",
        },
        t,
      );

      // Agrega el id de la nueva orden a cada item procesado
      const ordenItemsData = itemsProcesados.map((item) => ({
        ordenId: nuevaOrden.id,
        ...item,
      }));

      // Crea todos los items de la orden en una sola operación
      await OrderItemModel.bulkCreateOrderItems(ordenItemsData, t);

      // Descuenta del stock la cantidad comprada de cada producto
      for (const item of itemsProcesados) {
        const producto = await ProductoModel.findProductById(
          item.productoId,
          t,
        );

        // Verifica que el producto siga existiendo antes de actualizarlo
        if (!producto) {
          await t.rollback();
          res.status(404).json({ message: "Producto no encontrado." });
          return;
        }

        await ProductoModel.updateProductStock(
          item.productoId,
          producto.stock - item.cantidad,
          t,
        );
      }

      // Vacía el carrito eliminando todos sus items después de confirmar la compra
      await CarritoItemModel.deleteCartItemsByCartId(carrito.id, t);

      // Confirma todos los cambios de la transacción
      await t.commit();

      res.status(201).json({
        message: "Compra realizada con éxito.",
        orden: nuevaOrden,
      });
    } catch (error) {
      // Revierte todos los cambios si ocurre cualquier error durante el proceso de compra
      await t.rollback();
      console.error("Error al procesar la compra:", error);
      res.status(500).json({ message: "Error interno del servidor." });
    }
  }

  // Obtiene el historial de órdenes del usuario autenticado junto con los items de cada orden
  static async obtenerHistorialOrdenes(req: AuthRequest, res: Response) {
    try {
      // Verifica que haya un usuario autenticado
      if (!req.user) {
        res.status(401).json({ message: "Acceso denegado." });
        return;
      }

      const usuarioId = req.user.id;

      // Busca todas las órdenes del usuario incluyendo sus items asociados
      const ordenes =
        await OrdenModel.findAllOrdersByUserIdWithItems(usuarioId);

      res.status(200).json({ ordenes });
    } catch (error) {
      console.error("Error al obtener el historial de órdenes:", error);
      res.status(500).json({ message: "Error interno del servidor." });
    }
  }
}
