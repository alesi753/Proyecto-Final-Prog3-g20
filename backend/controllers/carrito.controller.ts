import { Request, Response } from 'express';
import { CarritoModel } from '../models/carrito.model';
import { CarritoItem, Producto } from '../models/index.model'; 

export class CarritoController {

  static async obtenerCarrito(req: Request, res: Response): Promise<void> {
    try {
      const usuarioId = (req as any).user.id;

    
      let carrito = await CarritoModel.findCartByUserId(usuarioId);
      if (!carrito) {
        carrito = await CarritoModel.createCart({ usuarioId });
      }

      const carritoConHardware = await CarritoModel.findOne({
        where: { id: carrito.id },
        include: [{
          model: Producto,
          as: 'productos', 
          through: { attributes: ['cantidad'] }
        }]
      });

      res.status(200).json(carritoConHardware);
    } catch (error) {
      console.error('Crash al obtener el carrito:', error);
      res.status(500).json({ message: 'Fallo de lectura de carrito de compras.' });
    }
  }

  static async agregarItem(req: Request, res: Response): Promise<void> {
    try {
      const usuarioId = (req as any).user.id;
      const { productoId, cantidad } = req.body;

      // Validación de entrada
      if (!productoId || !cantidad || cantidad <= 0) {
        res.status(400).json({ message: 'Fallo de integridad: Parámetros inválidos o cantidad negativa.' });
        return;
      }

      // Verificación de hardware en el catálogo
      const producto: any = await Producto.findByPk(productoId);
      if (!producto) {
        res.status(404).json({ message: 'Hardware no encontrado.' });
        return;
      }
      
      if (producto.stock < cantidad) {
        res.status(409).json({ message: `Excepción de inventario: Stock insuficiente. Disponible: ${producto.stock}` });
        return;
      }

      // Puntero al carrito del usuario
      let carrito = await CarritoModel.findCartByUserId(usuarioId);
      if (!carrito) {
        carrito = await CarritoModel.createCart({ usuarioId });
      }

      // Lectura de la tabla pivote
      const itemExistente: any = await CarritoItem.findOne({
        where: { carritoId: carrito.id, productoId }
      });

      if (itemExistente) {
        const nuevaCantidad = itemExistente.cantidad + cantidad;
        if (producto.stock < nuevaCantidad) {
          res.status(409).json({ message: 'Excepción de inventario: La suma supera el stock físico.' });
          return;
        }
        await itemExistente.update({ cantidad: nuevaCantidad });
      } else {
        await CarritoItem.create({ carritoId: carrito.id, productoId, cantidad });
      }

      res.status(200).json({ message: 'Hardware asignado al bloque de memoria del carrito.' });
    } catch (error) {
      console.error('Crash transaccional en agregarItem:', error);
      res.status(500).json({ message: 'Fallo de escritura transaccional.' });
    }
  }

  static async eliminarItem(req: Request, res: Response): Promise<void> {
    try {
      const usuarioId = (req as any).user.id;
      const productoId = parseInt(req.params.productoId as string, 10);

      const carrito = await CarritoModel.findCartByUserId(usuarioId);
      if (!carrito) {
        res.status(404).json({ message: 'Memoria vacía: Carrito no inicializado.' });
        return;
      }

      const item = await CarritoItem.findOne({
        where: { carritoId: carrito.id, productoId }
      });

      if (!item) {
        res.status(404).json({ message: 'Puntero nulo: Hardware no encontrado en el carrito.' });
        return;
      }

      // Baja física del registro en la tabla pivote
      await item.destroy();
      res.status(200).json({ message: 'Hardware purgado del carrito.' });
    } catch (error) {
      console.error('Crash en eliminarItem:', error);
      res.status(500).json({ message: 'Fallo al purgar memoria del servidor.' });
    }
  }
}