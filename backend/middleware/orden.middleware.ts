import { Request, Response, NextFunction } from "express";

// Lista de estados válidos que puede tener una orden
const validOrderStatuses = [
  "pendiente",
  "pagado",
  "preparando",
  "enviado",
  "entregado",
  "cancelado",
];

// Valida que el id recibido por params exista y sea un número válido
export const validateOrderIdParam = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    res.status(400).json({
      message: "El id de la orden debe ser un número válido.",
    });
    return;
  }

  next();
};

// Valida que el estado recibido en el body exista y sea uno de los permitidos
export const validateOrderStatus = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { estado } = req.body;

  if (!estado) {
    res.status(400).json({
      message: "El estado de la orden es obligatorio.",
    });
    return;
  }

  if (!validOrderStatuses.includes(estado)) {
    res.status(400).json({
      message: "El estado de la orden no es válido.",
    });
    return;
  }

  next();
};
