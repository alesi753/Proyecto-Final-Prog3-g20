import { Request, Response } from 'express';
import { MarcaModel } from '../models/marca.model';

export class MarcaController {
    
    static async getAllMarcas(req: Request, res: Response): Promise<void> {
        try {
            const marcas = await MarcaModel.findAllMarcas();
            res.json(marcas);
        } catch (error) {
            console.error('Error al obtener las marcas:', error);
            res.status(500).json({ message: 'Error al obtener las marcas' });
        }
    }

    static async getMarcaById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string, 10);
            const marca = await MarcaModel.findMarcaById(id);
            if (!marca) {
                res.status(404).json({ message: 'Marca no encontrada' });
                return;
            }
            res.json(marca);
        }
        catch (error) {
            console.error('Error al obtener la marca:', error);
            res.status(500).json({ message: 'Error al obtener la marca' });
        }
    }

    static async createMarca(req: Request, res: Response): Promise<void> {
        try {
            const nuevaMarca = await MarcaModel.createMarca(req.body);
            res.status(201).json(nuevaMarca);
        } catch (error) {
            console.error('Error al crear la marca:', error);
            res.status(500).json({ message: 'Error al crear la marca' });
        }
    }

    static async updateMarca(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string, 10);
            const marcaActualizada = await MarcaModel.updateMarca(id, req.body);
            if (!marcaActualizada) {
                res.status(404).json({ message: 'La marca que intentas actualizar no existe' });
                return;
            }
            res.json(marcaActualizada);
        } catch (error) {
            console.error('Error al actualizar la marca:', error);
            res.status(500).json({ message: 'Error interno al actualizar la marca' });
        }
    }

    static async deleteMarca(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string, 10);
            const eliminado = await MarcaModel.deleteMarca(id);
            if (!eliminado) {
                res.status(404).json({ message: 'La marca que intentas eliminar no existe' });
                return;
            }
            res.json(eliminado);
        } catch (error) {
            console.error('Error al eliminar la marca:', error);
            res.status(500).json({ message: 'Error interno al eliminar la marca' });
        }
    }

}

