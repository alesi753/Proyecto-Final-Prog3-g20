import { Request, Response } from 'express';
import { UsuarioModel } from '../models/usuario.model';

export class UsuarioController {
  
    static async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const usuarios = await UsuarioModel.findAllUsers();
            res.json(usuarios);
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            res.status(500).json({ message: 'Error al obtener los usuarios' });
        }
    }

    static async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string, 10);
            const usuario = await UsuarioModel.findUserById(id);
            if (!usuario) {
                res.status(404).json({ message: 'Usuario no encontrado' });
                return;
            }
            res.json(usuario);
        }
        catch (error) {
            console.error('Error al obtener el usuario:', error);
            res.status(500).json({ message: 'Error al obtener el usuario' });
        }
    }

    static async createUser(req: Request, res: Response): Promise<void> {
        try {
            const nuevoUsuario = await UsuarioModel.createUser(req.body);
            res.status(201).json(nuevoUsuario);
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            res.status(500).json({ message: 'Error al crear el usuario' });
        }
    }

    static async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string, 10);
            const usuarioActualizado = await UsuarioModel.updateUser(id, req.body);
            if (!usuarioActualizado) {
                res.status(404).json({ message: 'El usuario que intentas actualizar no existe' });
                return;
            }
            res.json(usuarioActualizado);
        }
        catch (error) {
            console.error('Error al actualizar el usuario:', error);
            res.status(500).json({ message: 'Error interno al actualizar el usuario' });
        }
    }

    static async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string, 10);
            const eliminado = await UsuarioModel.deleteUser(id);
            if (!eliminado) {
                res.status(404).json({ message: 'El usuario que intentas eliminar no existe' });
                return;
            }
            res.json(eliminado);
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
            res.status(500).json({ message: 'Error interno al eliminar el usuario' });
        }
    }

}