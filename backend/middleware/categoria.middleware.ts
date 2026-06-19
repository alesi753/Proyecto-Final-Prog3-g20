import { Request, Response, NextFunction } from "express";

export class CategoriaMiddleware {
  // Valida el parámetro :id de la ruta.
  // Se usa en endpoints como GET /categorias/:id, PUT /categorias/:id, DELETE /categorias/:id
  static validateCategoryId(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    const id = Number(req.params.id);

    // Verificamos que el id sea un número válido y mayor a 0
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        message: "El id de la categoría debe ser un número válido mayor a 0.",
      });
      return;
    }

    next();
  }

  // Valida el body para crear una categoría nueva
  static validateCreateCategory(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    const { nombre, padreId } = req.body;

    // El nombre es obligatorio
    if (typeof nombre !== "string" || nombre.trim() === "") {
      res.status(400).json({
        message: "El nombre de la categoría es obligatorio.",
      });

      return;
    }

    // Validamos longitud máxima según el schema: VARCHAR(100)
    if (nombre.trim().length > 100) {
      res.status(400).json({
        message:
          "El nombre de la categoría no puede superar los 100 caracteres.",
      });
      return;
    }

    // padreId es opcional, pero si viene debe ser numérico o null
    if (padreId !== undefined && padreId !== null) {
      const parsedPadreId = Number(padreId);

      if (!Number.isInteger(parsedPadreId) || parsedPadreId <= 0) {
        res.status(400).json({
          message: "padreId debe ser un número válido mayor a 0 o null.",
        });

        return;
      }

      // Normalizamos el valor para que llegue como número al controller
      req.body.padreId = parsedPadreId;
    }

    req.body.nombre = nombre.trim();
    next();
  }

  // Valida el body para actualizar una categoría, En update permitimos que vengan campos parciales
  static validateUpdateCategory(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    const { nombre, padreId } = req.body;
    const categoryId = Number(req.params.id);

    // Si viene nombre, validamos que sea string no vacío
    if (nombre !== undefined) {
      if (typeof nombre !== "string" || nombre.trim() === "") {
        res.status(400).json({
          message: "Si envías nombre, debe ser un string no vacío.",
        });
        return;
      }

      // Validamos el límite de 100 caracteres según la base de datos
      if (nombre.trim().length > 100) {
        res.status(400).json({
          message:
            "El nombre de la categoría no puede superar los 100 caracteres.",
        });
        return;
      }

      // Guardamos el nombre ya limpio
      req.body.nombre = nombre.trim();
    }

    // Si viene padreId, validamos que sea número válido o null
    if (padreId !== undefined && padreId !== null) {
      const parsedPadreId = Number(padreId);

      if (!Number.isInteger(parsedPadreId) || parsedPadreId <= 0) {
        res.status(400).json({
          message:
            "Si envías padreId, debe ser un número válido mayor a 0 o null.",
        });
        return;
      }

      // Evitamos que una categoría sea su propia categoría padre
      if (parsedPadreId === categoryId) {
        res.status(400).json({
          message: "Una categoría no puede ser su propia categoría padre.",
        });
        return;
      }

      // Normalizamos el valor para que llegue como número al controller/model
      req.body.padreId = parsedPadreId;
    }

    next();
  }
}