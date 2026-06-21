import { sequelize } from './index.model';
import { DataTypes, Model, Optional } from 'sequelize';
import { InterfaceCarrito } from '../interfaces/carrito.interfaces';

type CarritoModelAttributes = Omit<InterfaceCarrito, 'createdAt' | 'updatedAt'>;
type CartCreationAttributes = Optional<CarritoModelAttributes, 'id'>;

export class CarritoModel
  extends Model<CarritoModelAttributes, CartCreationAttributes>
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

  static async findCartByUserId(
    usuarioId: number
  ): Promise<CarritoModel | null> {
    return await CarritoModel.findOne({ where: { usuarioId } });
  }

  // Busca el carrito de un usuario e incluye los productos agregados
  // Se usa al confirmar la compra para procesar todo el contenido del carrito
  static async findCartByUserIdWithProducts(
    usuarioId: number,
    transaction?: any
  ): Promise<CarritoModel | null> {
    return await CarritoModel.findOne({
      where: { usuarioId },
      include: [
        {
          association: 'productos', // Incluye los productos del carrito usando el alias definido en la relación entre CarritoModel y ProductoModel mediante CarritoItemModel en cardinalidades.model.ts
          through: { attributes: ['cantidad'] }, // Incluye la cantidad de cada producto en el carrito desde la tabla intermedia CarritoItemModel
        },
      ],
      transaction,
    });
  }

  static async createCart(
    cartInput: CartCreationAttributes
  ): Promise<CarritoModel> {
    return await CarritoModel.create(cartInput);
  }

  static async updateCart(
    id: number,
    updateData: Partial<CarritoModelAttributes>
  ): Promise<CarritoModel | null> {
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
      autoIncrement: true,
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: 'usuarios', key: 'id' },
    },
  },
  {
    sequelize,
    tableName: 'carritos',
    timestamps: true,
  }
);
