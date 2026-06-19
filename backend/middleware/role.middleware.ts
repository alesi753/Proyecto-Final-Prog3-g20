import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

export class RoleMiddleware {
    
    static authorize(...allowedRoles: string[]) {
        return (req: AuthRequest, res: Response, next: NextFunction): void => {
            
            if (!req.user) {
                res.status(401).json({ message: 'No autorizado.' });
                return;
            }
            
            if (!allowedRoles.includes(req.user.rol)) {
                res.status(403).json({
                    message: 'No tienes permisos para realizar esta acción.'
                });
                return;
            }

            next();
        };
    }
}