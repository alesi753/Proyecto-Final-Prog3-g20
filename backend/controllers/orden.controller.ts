import { Request, Response } from 'express';
import { sequelize, Carrito, CarritoItem, Producto, OrdenItem } from '../models/index.model';
import { OrdenModel } from '../models/orden.model'; // Tu nuevo modelo tipado

interface AuthRequest extends Request {
  user?: { id: number };
}

export class OrdenController {
  
  static async procesarCheckout(req: AuthRequest, res: Response): Promise<void> {
    
    const t = await sequelize.transaction();

    try {
      const usuarioId = req.user?.id;

      if (!usuarioId) {
        await t.rollback();
        res.status(401).json({ message: 'Acceso denegado: Token de seguridad ausente.' });
        return;
      }

      
      const carrito: any = await Carrito.findOne({
        where: { usuarioId },
        include: [{
          model: Producto,
          as: 'productos',
          through: { attributes: ['cantidad'] }
        }],
        transaction: t
      });

      if (!carrito || !carrito.productos || carrito.productos.length === 0) {
        await t.rollback();
        res.status(400).json({ message: 'Excepción de ejecución: El carrito está vacío.' });
        return;
      }

     
      let totalOrden = 0;
      const itemsProcesados = [];

      for (const producto of carrito.productos) {
        const cantidadSolicitada = producto.CarritoItem.cantidad;

        if (producto.stock < cantidadSolicitada) {
          await t.rollback();
          res.status(409).json({ 
            message: `Excepción de inventario: Stock insuficiente para [${producto.nombre}]. Disponible: ${producto.stock}` 
          });
          return;
        }

        totalOrden += producto.precio * cantidadSolicitada;
        itemsProcesados.push({
          productoId: producto.id,
          cantidad: cantidadSolicitada,
          precioAlComprar: producto.precio 
        });
      }

      
      const nuevaOrden = await OrdenModel.create({
        usuarioId,
        precioTotal: totalOrden,
        estado: 'pendiente'
      }, { transaction: t });

     
      const ordenItemsData = itemsProcesados.map(item => ({
        ordenId: nuevaOrden.id,
        ...item
      }));
      await OrdenItem.bulkCreate(ordenItemsData, { transaction: t });

      for (const item of itemsProcesados) {
        const productoDb: any = await Producto.findByPk(item.productoId, { transaction: t });
        await productoDb.update({
          stock: productoDb.stock - item.cantidad
        }, { transaction: t });
      }

      
      await CarritoItem.destroy({
        where: { carritoId: carrito.id },
        transaction: t
      });

      
      await t.commit();

      res.status(201).json({
        message: 'Checkout ejecutado con éxito. Transacción completada.',
        orden: nuevaOrden
      });

    } catch (error) {
      // Dump de memoria y reversión del estado en caso de crash
      await t.rollback();
      console.error('Crash fatal en motor de pagos (procesarCheckout):', error);
      res.status(500).json({ message: 'Fallo catastrófico en el motor transaccional. Operación abortada.' });
    }
  }

  static async obtenerHistorialOrdenes(req: AuthRequest, res: Response): Promise<void> {
    try {
      const usuarioId = req.user?.id;

      // Lectura de logs transaccionales
      const ordenes = await OrdenModel.findAll({
        where: { usuarioId },
        include: [{
          model: OrdenItem,
          as: 'items' 
        }]
      });

      res.status(200).json({ ordenes });
    } catch (error) {
      console.error('Crash en obtenerHistorialOrdenes:', error);
      res.status(500).json({ message: 'Fallo de lectura del historial contable.' });
    }
  }
}