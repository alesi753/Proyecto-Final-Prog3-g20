import { Request, Response, NextFunction } from 'express';

export class MarcaMiddleware {
  // Valida el parámetro :id de la ruta
  static validateMarcaId(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        message: 'El id de la marca debe ser un número entero positivo.',
      });
      return;
    }

    next();
  }

  // Valida el body para crear una marca
  static validateCreateMarca(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const { nombre } = req.body;

    if (typeof nombre !== 'string' || nombre.trim() === '') {
      res.status(400).json({
        message: 'El nombre de la marca es obligatorio.',
      });
      return;
    }

    req.body.nombre = nombre.trim();

    next();
  }

  // Valida el body para actualizar una marca
  static validateUpdateMarca(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const { nombre } = req.body;

    if (nombre !== undefined) {
      if (typeof nombre !== 'string' || nombre.trim() === '') {
        res.status(400).json({
          message: 'Si envías nombre, debe ser un string no vacío.',
        });
        return;
      }

      req.body.nombre = nombre.trim();
    }

    next();
  }
}
