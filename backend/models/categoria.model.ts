import { sequelize } from './index.model';
import { DataTypes, Model, Optional } from 'sequelize';
import { InterfaceCategoria } from '../interfaces/categoria.interfaces';

// Omitimos el 'id'
type InputCategoria = Omit<InterfaceCategoria, 'id'>;

interface CategoriaCreationAttributes extends Optional<InterfaceCategoria, 'id'> {}

export class CategoriaModel
    extends Model<InterfaceCategoria, CategoriaCreationAttributes> 
    implements InterfaceCategoria 
{
    declare id: number;
    declare nombre: string;
    declare padreId: number | null; // null significa que es una categoría principal
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

    static async findAllCategories(): Promise<CategoriaModel[]> {
        return await CategoriaModel.findAll();
    }
    
    static async findCategoryById(id: number): Promise<CategoriaModel | null> {
        return await CategoriaModel.findByPk(id);
    }

    static async createCategory(categoriaInput: InputCategoria): Promise<CategoriaModel> {
        return await CategoriaModel.create(categoriaInput);
    }

    static async updateCategory(id: number, updateData: Partial<InputCategoria>): Promise<CategoriaModel | null> {
        const categoria = await CategoriaModel.findByPk(id);
        if (!categoria) return null;
        return await categoria.update(updateData);
    }

    static async deleteCategory(id: number): Promise<boolean> {
        const deletedRows = await CategoriaModel.destroy({ where: { id } });
        return deletedRows > 0;
    }
}

CategoriaModel.init(
    {
        id: { 
            type: DataTypes.INTEGER, 
            primaryKey: true, 
            autoIncrement: true 
        },
        nombre: { 
            type: DataTypes.STRING(100),
            allowNull: false, 
            unique: true
        },
        padreId: {
            type: DataTypes.INTEGER,
            allowNull: true, // permitir categorías principales
            onDelete: 'SET NULL', // Si se borra la categoría padre, las subcategorías quedan como principales
        }
    },
    {
        sequelize,
        tableName: 'categorias', 
        timestamps: true
    }
);