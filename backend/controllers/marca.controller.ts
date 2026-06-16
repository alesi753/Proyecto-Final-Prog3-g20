import { Request, Response } from "express";
import { MarcaModel } from "../models/marca.model";
import { ProductoModel } from "../models/producto.model";

export class MarcaController {
  // Obtiene todas las marcas
  static async getAllMarcas(req: Request, res: Response): Promise<void> {
    try {
      const marcas = await MarcaModel.findAllMarcas();

      res.status(200).json(marcas);
    } catch (error) {
      console.error("Error al obtener las marcas:", error);
      res.status(500).json({
        message: "Error interno al obtener las marcas.",
      });
    }
  }

  // Obtiene una marca por su id
  static async getMarcaById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const marca = await MarcaModel.findMarcaById(id);

      if (!marca) {
        res.status(404).json({
          message: "Marca no encontrada.",
        });
        return;
      }

      res.status(200).json(marca);
    } catch (error) {
      console.error("Error al obtener la marca:", error);
      res.status(500).json({
        message: "Error interno al obtener la marca.",
      });
    }
  }

  // Crea una nueva marca
  static async createMarca(req: Request, res: Response): Promise<void> {
    try {
      const nuevaMarca = await MarcaModel.createMarca(req.body);

      res.status(201).json({
        message: "Marca creada con éxito.",
        data: nuevaMarca,
      });
    } catch (error) {
      console.error("Error al crear la marca:", error);
      res.status(500).json({
        message: "Error interno al crear la marca.",
      });
    }
  }

  // Actualiza una marca existente
  static async updateMarca(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      // Verificamos si la marca existe
      const marca = await MarcaModel.findMarcaById(id);

      if (!marca) {
        res.status(404).json({
          message: "La marca que intentas actualizar no existe.",
        });
        return;
      }

      const marcaActualizada = await MarcaModel.updateMarca(id, req.body);

      res.status(200).json({
        message: "Marca actualizada con éxito.",
        data: marcaActualizada,
      });
    } catch (error) {
      console.error("Error al actualizar la marca:", error);
      res.status(500).json({
        message: "Error interno al actualizar la marca.",
      });
    }
  }

  // Elimina una marca por su id
  static async deleteMarca(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      // Verificamos si la marca existe
      const marca = await MarcaModel.findMarcaById(id);

      if (!marca) {
        res.status(404).json({
          message: "La marca que intentas eliminar no existe.",
        });
        return;
      }

      // Verificamos si tiene productos asociados
      const productosAsociados = await ProductoModel.count({
        where: { marcaId: id },
      });

      if (productosAsociados > 0) {
        res.status(409).json({
          message:
            "No se puede eliminar la marca porque tiene productos asociados.",
        });
        return;
      }

      const eliminada = await MarcaModel.deleteMarca(id);

      res.status(200).json({
        message: "Marca eliminada con éxito.",
        data: eliminada,
      });
    } catch (error) {
      console.error("Error al eliminar la marca:", error);
      res.status(500).json({
        message: "Error interno al eliminar la marca.",
      });
    }
  }
}
