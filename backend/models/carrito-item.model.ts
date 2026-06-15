import { sequelize } from './index.model';
import { DataTypes, Model, Optional } from 'sequelize';
import { InterfaceCarritoItem } from '../interfaces/carrito-item.interfaces';

type InputCartItem = Omit<InterfaceCarritoItem, 'id'>;
interface CartItemCreationAttributes extends Optional<InterfaceCarritoItem, 'id'> {}

export class CarritoItemModel
    extends Model<InterfaceCarritoItem, CartItemCreationAttributes> 
    implements InterfaceCarritoItem 
{
    declare id: number;
    declare carritoId: number;
    declare productoId: number;
    declare cantidad: number;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;


    static async findAllCartItems(): Promise<CarritoItemModel[]> {
        return await CarritoItemModel.findAll();
    }
    
    static async findCartItemById(id: number): Promise<CarritoItemModel | null> {
        return await CarritoItemModel.findByPk(id);
    }

    /*
    Método estatico: addOrUpdateCartItem
    - Gestionar la adición de productos al carrito evitando duplicados.
    - Si el producto ya existe en el carrito, se actualiza la cantidad sumando la nueva cantidad a la existente.
    
    - Idea: Se usa cuando el usuario está "comprando" desde el catálogo.
    */
    static async addOrUpdateCartItem(cartItemInput: InputCartItem): Promise<CarritoItemModel> {
        const { carritoId, productoId, cantidad } = cartItemInput;

        // Verificar si el producto ya está en este carrito específico
        const existingItem = await CarritoItemModel.findOne({
            where: { carritoId, productoId }
        });

        // SI EXISTE: Incrementa la columna directamente en la BD
        if (existingItem) {
            return await existingItem.increment('cantidad', { by: cantidad });
        }

        // SI NO EXISTE: Crear nuevo registro
        return await CarritoItemModel.create(cartItemInput);
    }

    /* 
    Método estatico: updateCartItem
    - Actualiza un item del carrito (por ejemplo, cambiar la cantidad directamente)
    
    - Idea: Se usa cuando el usuario está gestionando/editando su carrito abierto.
    */
    static async updateCartItem(id: number, updateData: Partial<InputCartItem>): Promise<CarritoItemModel | null> {
        const cartItem = await CarritoItemModel.findByPk(id);
        if (!cartItem) return null;
        return await cartItem.update(updateData);
    }

    static async deleteCartItem(id: number): Promise<boolean> {
        const deletedRows = await CarritoItemModel.destroy({ where: { id } });
        return deletedRows > 0;
    }
}

CarritoItemModel.init(
    {
        id: { 
            type: DataTypes.INTEGER, 
            primaryKey: true, 
            autoIncrement: true 
        },
        carritoId: { 
            type: DataTypes.INTEGER, 
            allowNull: false
        },
        productoId: { 
            type: DataTypes.INTEGER, 
            allowNull: false
        },
        cantidad: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        }
    },
    {
        sequelize,
        tableName: 'carrito_items',
        timestamps: true,

        /*
        Nota de indexación: Contiene un índice único compuesto en `(carritoId, productoId)` para evitar filas duplicadas del mismo producto en un carrito. 
        Si se agrega el mismo producto, se actualiza la `cantidad`.
        */
        indexes: [
            {
                unique: true,
                fields: ['carritoId', 'productoId'],
                name: 'idx_carrito_producto_unique'
            }
        ]        
    }
);