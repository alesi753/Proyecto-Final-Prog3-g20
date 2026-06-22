import { Request, Response } from 'express';
import { UsuarioModel } from '../models/usuario.model';
import { AuthMiddleware, AuthRequest } from '../middleware/auth.middleware';

export class AuthController {
  // Método para registrar usuario
  public static async register(req: Request, res: Response): Promise<Response> {
    try {
      
      const { nombre, apellido, correo, password } = req.body;

      const newUser = await UsuarioModel.createUser({
        nombre: nombre,
        apellido: apellido,
        correo: correo,
        password: password,
        // Forzamos estrictamente el rol por defecto
        rol: 'cliente', 
      });

      const userResponse = {
        id: newUser.id,
        nombre: newUser.nombre,
        correo: newUser.correo,
      };

      return res.status(201).json({
        message: 'Usuario registrado exitosamente',
        user: userResponse,
        token: AuthMiddleware.generarToken(newUser),
      });
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      return res
        .status(500)
        .json({ message: 'Error al procesar registro de usuario.' });
    }
  }

  // Método para iniciar sesión
  public static async login(req: Request, res: Response): Promise<Response> {
    try {
      const { correo, password } = req.body;

      // Búsqueda usuario por correo electrónico
      const user = await UsuarioModel.findUserByEmail(correo);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }

      const passwordValida = await user.validarPassword(password);
      if (!passwordValida) {
        return res.status(401).json({ message: 'Contraseña incorrecta.' });
      }

      const userResponse = {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
      };

      return res.status(200).json({
        message: 'Login exitoso',
        user: userResponse,
        token: AuthMiddleware.generarToken(user),
      });
    } catch (error) {
      console.error('Error en login:', error);
      return res
        .status(500)
        .json({ message: 'Error al procesar lectura de inicio de sesión.' });
    }
  }

  // Método para ver el perfil
  public static async perfil(
    req: AuthRequest,
    res: Response
  ): Promise<Response> {
    try {
      // Verificamos que el auth.middleware haya agregado el usuario al request
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'No autorizado.' });
      }

      // Buscamos el usuario
      const user = await UsuarioModel.findUserById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }

      // Como findUserById trae todo, sacamos el password antes de enviarlo
      const { password, ...userWithoutPassword } = user.toJSON();

      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error('Error en perfil:', error);
      return res
        .status(500)
        .json({ message: 'Error al procesar lectura de perfil.' });
    }
  }
}
