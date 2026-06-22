import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_por_defecto';

// Interface para tipar el payload del token
export interface TokenPayload {
  id: number;
  correo: string;
  rol: 'admin' | 'cliente';
}

// Extendemos la interfaz Request de Express para incluir un campo opcional 'user' que tendrá la información del token decodificado
export interface AuthRequest extends Request {
  user: TokenPayload | null;
}

export class AuthMiddleware {
  // El objeto user que se le pasa a generarToken solo incluye los campos necesarios para el payload del token, id y correo.
  public static generarToken(user: {
    id: number;
    correo: string;
    rol: 'admin' | 'cliente';
  }): string {
    const payload: TokenPayload = {
      id: user.id,
      correo: user.correo,
      rol: user.rol,
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
  }

  public static verificarToken(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Response | void {
    // El token se espera en el header Authorization con formato "Bearer <token>"
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    // Extraemos el token del header (removemos el "Bearer " al inicio)
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Formato de token inválido' });
    }

    try {
      // Verificamos y le decimos a TypeScript que el resultado de jwt.verify es del tipo TokenPayload
      const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;

      // Guardamos los datos del usuario en req.user
      req.user = payload;

      next();
    } catch (error) {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }
  }
}
