import { Request, Response, NextFunction } from 'express';

export class UsuarioMiddleware {
  // Valida el parámetro :id de la ruta
  static validateUserId(req: Request, res: Response, next: NextFunction): void {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        message: 'El id del usuario debe ser un número entero positivo.',
      });
      return;
    }

    next();
  }

  // Valida el body para crear un usuario
  static validateCreateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const { nombre, apellido, correo, password, rol } = req.body;

    if (typeof nombre !== 'string' || nombre.trim() === '') {
      res.status(400).json({
        message: 'El nombre es obligatorio.',
      });
      return;
    }

    if (typeof apellido !== 'string' || apellido.trim() === '') {
      res.status(400).json({
        message: 'El apellido es obligatorio.',
      });
      return;
    }

    if (typeof correo !== 'string' || correo.trim() === '') {
      res.status(400).json({
        message: 'El correo es obligatorio.',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo.trim())) {
      res.status(400).json({
        message: 'El correo debe tener un formato válido.',
      });
      return;
    }

    if (typeof password !== 'string' || password.trim() === '') {
      res.status(400).json({
        message: 'La contraseña es obligatoria.',
      });
      return;
    }

    if (rol !== 'cliente' && rol !== 'admin') {
      res.status(400).json({
        message: "El rol debe ser 'cliente' o 'admin'.",
      });
      return;
    }

    req.body.nombre = nombre.trim();
    req.body.apellido = apellido.trim();
    req.body.correo = correo.trim().toLowerCase();
    req.body.password = password.trim();

    next();
  }

  // Valida el body para actualizar un usuario
  static validateUpdateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const { nombre, apellido, correo, password, rol } = req.body;

    if (nombre !== undefined) {
      if (typeof nombre !== 'string' || nombre.trim() === '') {
        res.status(400).json({
          message: 'Si envías nombre, debe ser un string no vacío.',
        });
        return;
      }

      req.body.nombre = nombre.trim();
    }

    if (apellido !== undefined) {
      if (typeof apellido !== 'string' || apellido.trim() === '') {
        res.status(400).json({
          message: 'Si envías apellido, debe ser un string no vacío.',
        });
        return;
      }

      req.body.apellido = apellido.trim();
    }

    if (correo !== undefined) {
      if (typeof correo !== 'string' || correo.trim() === '') {
        res.status(400).json({
          message: 'Si envías correo, debe ser un string no vacío.',
        });
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(correo.trim())) {
        res.status(400).json({
          message: 'Si envías correo, debe tener un formato válido.',
        });
        return;
      }

      req.body.correo = correo.trim().toLowerCase();
    }

    if (password !== undefined) {
      if (typeof password !== 'string' || password.trim() === '') {
        res.status(400).json({
          message: 'Si envías password, debe ser un string no vacío.',
        });
        return;
      }

      req.body.password = password.trim();
    }

    if (rol !== undefined) {
      if (rol !== 'cliente' && rol !== 'admin') {
        res.status(400).json({
          message: "Si envías rol, debe ser 'cliente' o 'admin'.",
        });
        return;
      }
    }

    next();
  }
}
