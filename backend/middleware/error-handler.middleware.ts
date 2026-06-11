import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'sequelize';

const errorHandler = (err: Error | ValidationError, req: Request, res: Response, next: NextFunction) => {
  console.error(`[SERVER ERROR]: ${err.message}`)

  // Si el error viene de Sequelize (ej: error de validación de base de datos)
  if (err.name === 'SequelizeValidationError') {
    
    // Le decimos a TypeScript que trate este error específicamente como un ValidationError
    const sequelizeError = err as ValidationError;
    
    return res.status(400).json({
      error: 'Error de validación en la base de datos',
      detalles: sequelizeError.errors.map((e) => e.message)
    })
  }

  // Cualquier otro error inesperado responde 500
  return res.status(500).json({
    error: 'Ocurrió un error interno en el servidor'
  })
}

// Exportamos el middleware para usarlo en server.js, Usamos export = para ser compatible con CommonJS
export = errorHandler;