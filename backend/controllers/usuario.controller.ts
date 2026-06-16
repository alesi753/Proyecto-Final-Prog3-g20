import { Request, Response } from "express";
import { UsuarioModel } from "../models/usuario.model";
import { CarritoModel } from "../models/carrito.model";
import { OrdenModel } from "../models/orden.model";

export class UsuarioController {
  // Obtiene todos los usuarios
  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const usuarios = await UsuarioModel.findAllUsers();

      const usuariosSinPassword = usuarios.map((usuario) => {
        const { password, ...usuarioSinPassword } = usuario.toJSON();
        return usuarioSinPassword;
      });

      res.status(200).json(usuariosSinPassword);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      res.status(500).json({
        message: "Error interno al obtener los usuarios.",
      });
    }
  }

  // Obtiene un usuario por su id
  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const usuario = await UsuarioModel.findUserById(id);

      if (!usuario) {
        res.status(404).json({
          message: "Usuario no encontrado.",
        });
        return;
      }

      const { password, ...usuarioSinPassword } = usuario.toJSON();

      res.status(200).json(usuarioSinPassword);
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
      res.status(500).json({
        message: "Error interno al obtener el usuario.",
      });
    }
  }

  // Crea un nuevo usuario
  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { correo } = req.body;

      // Verificamos si ya existe un usuario con ese correo
      const usuarioExistente = await UsuarioModel.findUserByEmail(correo);

      if (usuarioExistente) {
        res.status(409).json({
          message: "Ya existe un usuario registrado con ese correo.",
        });
        return;
      }

      const nuevoUsuario = await UsuarioModel.createUser(req.body);
      const { password, ...usuarioSinPassword } = nuevoUsuario.toJSON();

      res.status(201).json({
        message: "Usuario creado con éxito.",
        data: usuarioSinPassword,
      });
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      res.status(500).json({
        message: "Error interno al crear el usuario.",
      });
    }
  }

  // Actualiza un usuario existente
  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      // Verificamos si el usuario existe
      const usuario = await UsuarioModel.findUserById(id);

      if (!usuario) {
        res.status(404).json({
          message: "El usuario que intentas actualizar no existe.",
        });
        return;
      }

      // Si envían correo, verificamos que no esté en uso por otro usuario
      if (req.body.correo !== undefined) {
        const usuarioConEseCorreo = await UsuarioModel.findUserByEmail(
          req.body.correo,
        );

        if (usuarioConEseCorreo && usuarioConEseCorreo.id !== id) {
          res.status(409).json({
            message: "Ya existe otro usuario registrado con ese correo.",
          });
          return;
        }
      }

      const usuarioActualizado = await UsuarioModel.updateUser(id, req.body);

      if (!usuarioActualizado) {
        res.status(500).json({
          message: "No se pudo actualizar el usuario.",
        });
        return;
      }

      const { password, ...usuarioSinPassword } = usuarioActualizado.toJSON();

      res.status(200).json({
        message: "Usuario actualizado con éxito.",
        data: usuarioSinPassword,
      });
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      res.status(500).json({
        message: "Error interno al actualizar el usuario.",
      });
    }
  }

  // Elimina un usuario por su id
  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      const usuario = await UsuarioModel.findUserById(id);

      if (!usuario) {
        res.status(404).json({
          message: "El usuario que intentas eliminar no existe.",
        });
        return;
      }

      const [carritoAsociado, ordenesAsociadas] = await Promise.all([
        CarritoModel.findCartByUserId(id),
        OrdenModel.count({ where: { usuarioId: id } }),
      ]);

      if (carritoAsociado) {
        res.status(409).json({
          message:
            "No se puede eliminar el usuario porque tiene un carrito asociado.",
        });
        return;
      }

      if (ordenesAsociadas > 0) {
        res.status(409).json({
          message:
            "No se puede eliminar el usuario porque tiene órdenes asociadas.",
        });
        return;
      }

      const eliminado = await UsuarioModel.deleteUser(id);

      if (!eliminado) {
        res.status(500).json({
          message: "No se pudo eliminar el usuario.",
        });
        return;
      }

      res.status(200).json({
        message: "Usuario eliminado con éxito.",
      });
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      res.status(500).json({
        message: "Error interno al eliminar el usuario.",
      });
    }
  }
}
