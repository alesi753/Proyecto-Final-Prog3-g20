import { sequelize } from './index.model';
import { DataTypes, Model, Optional } from 'sequelize';
import { InterfaceProducto } from '../interfaces/producto.interfaces';

// Omitimos 'id' y el atributo 'activo' se vuelve opcional (podemos omitirlo al crear un producto, y se asumirá que es true por defecto)
type InputProduct = Omit<InterfaceProducto, 'id' | 'activo'> & { activo?: boolean };

interface ProductCreationAttributes extends Optional<InterfaceProducto, 'id' | 'activo'> {}

export class ProductoModel
    extends Model<InterfaceProducto, ProductCreationAttributes> 
    implements InterfaceProducto 
{
    declare id: number;
    declare categoriaId: number;
    declare nombre: string;
    declare descripcion: string;
    declare marca: string;
    declare precio: number;
    declare stock: number;
    declare especificaciones: Record<string, any>;
    declare activo: boolean;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;


    static async findAllProducts(): Promise<ProductoModel[]> {
        // Trae solo los activos por defecto
        return await ProductoModel.findAll({ where: { activo: true } });
    }
    
    static async findProductById(id: number): Promise<ProductoModel | null> {
        return await ProductoModel.findOne({ where: { id, activo: true } });
    }

    static async createProduct(productInput: InputProduct): Promise<ProductoModel> {
        return await ProductoModel.create(productInput);
    }

    static async updateProduct(id: number, updateData: Partial<InputProduct>): Promise<ProductoModel | null> {
        const product = await ProductoModel.findOne({ where: { id, activo: true } });
        if (!product) return null;
        return await product.update(updateData);
    }

    // DESHABILITAR (Soft Delete): Cambia el valor del campo 'activo'
    static async disableProduct(id: number): Promise<boolean> {
        const product = await ProductoModel.findByPk(id);
        if (!product || !product.activo) 
            return false;

        await product.update({ activo: false }); 
        return true;
    }

    // ELIMINAR (Hard Delete): Lo borra permanentemente de la BD
    static async deleteProduct(id: number): Promise<boolean> {
        const deletedRows = await ProductoModel.destroy({ where: { id } });
        return deletedRows > 0;
    }
}

ProductoModel.init(
    {
        id: { 
            type: DataTypes.INTEGER, 
            primaryKey: true, 
            autoIncrement: true 
        },
        categoriaId: { 
            type: DataTypes.INTEGER, 
            allowNull: false
        },
        nombre: { 
            type: DataTypes.STRING(255), 
            allowNull: false 
        },
        descripcion: { 
            type: DataTypes.STRING(255), 
            allowNull: false 
        },
        marca: { 
            type: DataTypes.STRING(100), 
            allowNull: false 
        },
        precio: { 
            type: DataTypes.DECIMAL(10, 2), // NUMERIC(10,2) en PostgreSQL
            allowNull: false 
        },
        stock: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        especificaciones: { 
            type: DataTypes.JSONB, 
            allowNull: true 
        },
        activo: { 
            type: DataTypes.BOOLEAN, 
            allowNull: false, 
            defaultValue: true 
        }
    },
    {
        sequelize,
        tableName: 'productos', 
        timestamps: true 
    }
);
