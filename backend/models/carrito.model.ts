import { sequelize } from './index.model';
import { DataTypes, Model, Optional } from 'sequelize';
import { InterfaceCarrito } from '../interfaces/carrito.interfaces';

type InputCart = Omit<InterfaceCarrito, 'id'>;
interface CartCreationAttributes extends Optional<InterfaceCarrito, 'id'> {}

export class CarritoModel
    extends Model<InterfaceCarrito, CartCreationAttributes> 
    implements InterfaceCarrito 
{
    declare id: number;
    declare usuarioId: number;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

    static async findAllCarts(): Promise<CarritoModel[]> {
        return await CarritoModel.findAll();
    }
    
    static async findCartById(id: number): Promise<CarritoModel | null> {
        return await CarritoModel.findByPk(id);
    }

    // Buscar el carrito directamente por el ID del usuario
    static async findCartByUserId(usuarioId: number): Promise<CarritoModel | null> {
        return await CarritoModel.findOne({ where: { usuarioId } });
    }

    static async createCart(cartInput: InputCart): Promise<CarritoModel> {
        return await CarritoModel.create(cartInput);
    }

    static async updateCart(id: number, updateData: Partial<InputCart>): Promise<CarritoModel | null> {
        const cart = await CarritoModel.findByPk(id);
        if (!cart) return null;
        return await cart.update(updateData);
    }

    static async deleteCart(id: number): Promise<boolean> {
        const deletedRows = await CarritoModel.destroy({ where: { id } });
        return deletedRows > 0;
    }
}


CarritoModel.init(
    {
        id: { 
            type: DataTypes.INTEGER, 
            primaryKey: true, 
            autoIncrement: true 
        },
        usuarioId: { 
            type: DataTypes.INTEGER, 
            allowNull: false,
            unique: true // Garantiza que un usuario no pueda tener dos carritos
        }
    },
    {
        sequelize,
        tableName: 'carritos', 
        timestamps: true
    }
);