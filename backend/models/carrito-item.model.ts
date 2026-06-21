import { sequelize } from './index.model';
import { DataTypes, Model, Optional } from 'sequelize';
import { InterfaceCarritoItem } from '../interfaces/carrito-item.interfaces';

type CarritoItemModelAttributes = Omit<
  InterfaceCarritoItem,
  'createdAt' | 'updatedAt'
>;
type CartItemCreationAttributes = Optional<CarritoItemModelAttributes, 'id'>;

export class CarritoItemModel
  extends Model<CarritoItemModelAttributes, CartItemCreationAttributes>
  implements InterfaceCarritoItem
{
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

  // Busca un item específico dentro de un carrito
  static async findCartItemByCartAndProduct(
    carritoId: number,
    productoId: number
  ): Promise<CarritoItemModel | null> {
    return await CarritoItemModel.findOne({
      where: { carritoId, productoId },
    });
  }

  // Crea un nuevo item en el carrito
  static async createCartItem(
    cartItemInput: CartItemCreationAttributes
  ): Promise<CarritoItemModel> {
    return await CarritoItemModel.create(cartItemInput);
  }

  // Actualiza un item del carrito por id
  static async updateCartItem(
    id: number,
    updateData: Partial<CarritoItemModelAttributes>
  ): Promise<CarritoItemModel | null> {
    const cartItem = await CarritoItemModel.findByPk(id);

    if (!cartItem) return null;

    return await cartItem.update(updateData);
  }

  // Elimina un item del carrito por id
  static async deleteCartItem(id: number): Promise<boolean> {
    const deletedRows = await CarritoItemModel.destroy({ where: { id } });
    return deletedRows > 0;
  }

  // Elimina todos los items de un carrito específico
  // Se usa al confirmar la compra para vaciar el carrito del usuario
  static async deleteCartItemsByCartId(
    carritoId: number,
    transaction?: any
  ): Promise<boolean> {
    const deletedRows = await CarritoItemModel.destroy({
      where: { carritoId },
      transaction,
    });

    return deletedRows > 0;
  }

  // Elimina un item del carrito usando carritoId y productoId
  static async deleteCartItemByCartAndProduct(
    carritoId: number,
    productoId: number
  ): Promise<boolean> {
    const deletedRows = await CarritoItemModel.destroy({
      where: { carritoId, productoId },
    });

    return deletedRows > 0;
  }
}

CarritoItemModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    carritoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'carritos', key: 'id' },
    },
    productoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'productos', key: 'id' },
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'CarritoItem',
    tableName: 'carrito_items',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['carritoId', 'productoId'],
        name: 'idx_carrito_producto_unique',
      },
    ],
  }
);
