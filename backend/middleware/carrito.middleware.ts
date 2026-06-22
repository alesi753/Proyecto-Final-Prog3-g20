import { Request, Response, NextFunction } from 'express';

export class CarritoMiddleware {
  static validateAgregarItem(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const { productoId, cantidad } = req.body;

    const parsedProductoId = Number(productoId);
    const parsedCantidad = Number(cantidad);

    if (!Number.isInteger(parsedProductoId) || parsedProductoId <= 0) {
      res.status(400).json({
        message: 'productoId debe ser un número entero positivo.',
      });
      return;
    }

    if (!Number.isInteger(parsedCantidad) || parsedCantidad <= 0) {
      res.status(400).json({
        message: 'cantidad debe ser un número entero positivo.',
      });
      return;
    }

    req.body.productoId = parsedProductoId;
    req.body.cantidad = parsedCantidad;

    next();
  }

  static validateProductoIdParam(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const productoId = Number(req.params.productoId);

    if (!Number.isInteger(productoId) || productoId <= 0) {
      res.status(400).json({
        message: 'El productoId debe ser un número entero positivo.',
      });
      return;
    }

    next();
  }
}
