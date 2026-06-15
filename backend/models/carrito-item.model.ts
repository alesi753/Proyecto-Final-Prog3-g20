import { sequelize } from './index.model';
import { DataTypes, Model, Optional } from 'sequelize';
import { InterfaceCarritoItem } from '../interfaces/carrito-item.interfaces';

type CarritoItemModelAttributes = Omit<InterfaceCarritoItem, 'createdAt' | 'updatedAt'>;
type CartItemCreationAttributes = Optional<CarritoItemModelAttributes, 'id'>;

export class CarritoItemModel
  extends Model<CarritoItemModelAttributes, CartItemCreationAttributes>
  implements InterfaceCarritoItem {
  declare id: number;
  declare carritoId: number;
  declare productoId: number;
  declare cantidad: number;

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
  static async addOrUpdateCartItem(cartItemInput: CartItemCreationAttributes): Promise<CarritoItemModel> {
    const { carritoId, productoId, cantidad } = cartItemInput;
    const existingItem = await CarritoItemModel.findOne({
      where: { carritoId, productoId }
    });
    if (existingItem) {
      return await existingItem.increment('cantidad', { by: cantidad });
    }
    return await CarritoItemModel.create(cartItemInput);
  }

  /*
  Método estatico: updateCartItem
  - Actualiza un item del carrito (por ejemplo, cambiar la cantidad directamente)
  - Idea: Se usa cuando el usuario está gestionando/editando su carrito abierto.
  */
  static async updateCartItem(id: number, updateData: Partial<CarritoItemModelAttributes>): Promise<CarritoItemModel | null> {
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
      allowNull: false,
      references: { model: 'carritos', key: 'id' }
    },
    productoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'productos', key: 'id' }
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
    indexes: [
      {
        unique: true,
        fields: ['carritoId', 'productoId'],
        name: 'idx_carrito_producto_unique'
      }
    ]
  }
);
