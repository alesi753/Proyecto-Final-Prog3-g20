import { sequelize } from "./index.model";
import { DataTypes, Model, Optional } from "sequelize";
import { InterfaceOrdenItem } from "../interfaces/orden-item.interfaces";

type OrdenItemModelAttributes = Omit<
  InterfaceOrdenItem,
  "createdAt" | "updatedAt"
>;
type OrderItemCreationAttributes = Optional<OrdenItemModelAttributes, "id">;

export class OrderItemModel
  extends Model<OrdenItemModelAttributes, OrderItemCreationAttributes>
  implements InterfaceOrdenItem
{
  declare id: number;
  declare ordenId: number;
  declare productoId: number;
  declare cantidad: number;
  declare precioAlComprar: number;

  static async findAllOrderItems(): Promise<OrderItemModel[]> {
    return await OrderItemModel.findAll();
  }

  static async findOrderItemById(id: number): Promise<OrderItemModel | null> {
    return await OrderItemModel.findByPk(id);
  }

  static async findOrderItemsByOrdenId(
    ordenId: number,
  ): Promise<OrderItemModel[]> {
    return await OrderItemModel.findAll({ where: { ordenId } });
  }

  static async createOrderItem(
    orderItemInput: OrderItemCreationAttributes,
  ): Promise<OrderItemModel> {
    return await OrderItemModel.create(orderItemInput);
  }

  // Crea varios items de una orden en una sola operación
  // Se usa al confirmar la compra para guardar todos los productos de la orden
  static async bulkCreateOrderItems(
    orderItemsInput: OrderItemCreationAttributes[],
    transaction?: any,
  ): Promise<OrderItemModel[]> {
    return await OrderItemModel.bulkCreate(orderItemsInput, { transaction });
  }

  static async updateOrderItem(
    id: number,
    updateData: Partial<OrdenItemModelAttributes>,
  ): Promise<OrderItemModel | null> {
    const orderItem = await OrderItemModel.findByPk(id);
    if (!orderItem) return null;
    return await orderItem.update(updateData);
  }

  static async deleteOrderItem(id: number): Promise<boolean> {
    const deletedRows = await OrderItemModel.destroy({ where: { id } });
    return deletedRows > 0;
  }
}

OrderItemModel.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ordenId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "ordenes", key: "id" },
    },
    productoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "productos", key: "id" },
    },
    cantidad: { type: DataTypes.INTEGER, allowNull: false },
    precioAlComprar: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  },
  {
    sequelize,
    tableName: "orden_items",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["ordenId", "productoId"],
        name: "idx_orden_producto_unique",
      },
    ],
  },
);
