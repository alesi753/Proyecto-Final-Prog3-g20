import { Request, Response, NextFunction } from "express";

export class ProductoMiddleware {
  // Valida el parámetro :id de la ruta
  static validateProductId(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    const id = Number(req.params.id);

    // El id debe ser un número entero positivo
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        message: "El id del producto debe ser un número entero positivo.",
      });
      return;
    }

    next();
  }

  // Valida el body para crear un producto nuevo
  static validateCreateProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    const { categoriaId, marcaId, modelo, precio, stock, especificaciones } =
      req.body;

    // categoriaId es obligatorio y debe ser un entero positivo
    const parsedCategoriaId = Number(categoriaId);
    if (!Number.isInteger(parsedCategoriaId) || parsedCategoriaId <= 0) {
      res.status(400).json({
        message:
          "categoriaId es obligatorio y debe ser un número entero positivo.",
      });
      return;
    }

    // marcaId es obligatorio y debe ser un entero positivo
    const parsedMarcaId = Number(marcaId);
    if (!Number.isInteger(parsedMarcaId) || parsedMarcaId <= 0) {
      res.status(400).json({
        message: "marcaId es obligatorio y debe ser un número entero positivo.",
      });
      return;
    }

    // modelo es obligatorio y no puede ser vacío
    if (typeof modelo !== "string" || modelo.trim() === "") {
      res.status(400).json({
        message: "El modelo del producto es obligatorio.",
      });
      return;
    }

    // precio es obligatorio, debe ser numérico y no puede ser negativo
    const parsedPrecio = Number(precio);
    if (Number.isNaN(parsedPrecio) || parsedPrecio < 0) {
      res.status(400).json({
        message: "El precio debe ser un número válido mayor o igual a 0.",
      });
      return;
    }

    // stock es obligatorio y debe ser un entero mayor o igual a 0
    const parsedStock = Number(stock);
    if (!Number.isInteger(parsedStock) || parsedStock < 0) {
      res.status(400).json({
        message: "El stock debe ser un número entero mayor o igual a 0.",
      });
      return;
    }

    // especificaciones es opcional, pero si viene debe ser un objeto JSON válido
    if (especificaciones !== undefined) {
      if (
        typeof especificaciones !== "object" ||
        especificaciones === null ||
        Array.isArray(especificaciones)
      ) {
        res.status(400).json({
          message: "especificaciones debe ser un objeto JSON válido.",
        });
        return;
      }
    }

    // Normalizamos los datos antes de enviarlos al controller/model
    req.body.categoriaId = parsedCategoriaId;
    req.body.marcaId = parsedMarcaId;
    req.body.modelo = modelo.trim();
    req.body.precio = parsedPrecio;
    req.body.stock = parsedStock;

    // Si no envían especificaciones, usamos un objeto vacío
    if (especificaciones === undefined) {
      req.body.especificaciones = {};
    }

    next();
  }

  // Valida el body para actualizar un producto
  // En update los campos son opcionales, pero si vienen deben ser válidos
  static validateUpdateProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    const { categoriaId, marcaId, modelo, precio, stock, especificaciones } =
      req.body;

    if (categoriaId !== undefined) {
      const parsedCategoriaId = Number(categoriaId);

      if (!Number.isInteger(parsedCategoriaId) || parsedCategoriaId <= 0) {
        res.status(400).json({
          message: "Si envías categoriaId, debe ser un número entero positivo.",
        });
        return;
      }

      req.body.categoriaId = parsedCategoriaId;
    }

    if (marcaId !== undefined) {
      const parsedMarcaId = Number(marcaId);

      if (!Number.isInteger(parsedMarcaId) || parsedMarcaId <= 0) {
        res.status(400).json({
          message: "Si envías marcaId, debe ser un número entero positivo.",
        });
        return;
      }

      req.body.marcaId = parsedMarcaId;
    }

    if (modelo !== undefined) {
      if (typeof modelo !== "string" || modelo.trim() === "") {
        res.status(400).json({
          message: "Si envías modelo, debe ser un string no vacío.",
        });
        return;
      }

      req.body.modelo = modelo.trim();
    }

    if (precio !== undefined) {
      const parsedPrecio = Number(precio);

      if (Number.isNaN(parsedPrecio) || parsedPrecio < 0) {
        res.status(400).json({
          message:
            "Si envías precio, debe ser un número válido mayor o igual a 0.",
        });
        return;
      }

      req.body.precio = parsedPrecio;
    }

    if (stock !== undefined) {
      const parsedStock = Number(stock);

      if (!Number.isInteger(parsedStock) || parsedStock < 0) {
        res.status(400).json({
          message:
            "Si envías stock, debe ser un número entero mayor o igual a 0.",
        });
        return;
      }

      req.body.stock = parsedStock;
    }

    if (especificaciones !== undefined) {
      if (
        typeof especificaciones !== "object" ||
        especificaciones === null ||
        Array.isArray(especificaciones)
      ) {
        res.status(400).json({
          message:
            "Si envías especificaciones, debe ser un objeto JSON válido.",
        });
        return;
      }
    }

    next();
  }
}
