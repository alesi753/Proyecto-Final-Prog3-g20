import { sequelize } from './index.model';
import { DataTypes, Model, Optional } from 'sequelize';
import { InterfaceOrdenItem } from '../interfaces/orden-item.interfaces';

type InputOrderItem = Omit<InterfaceOrdenItem, 'id'>;
interface OrderItemCreationAttributes extends Optional<InterfaceOrdenItem, 'id'> {}

export class OrderItemModel
    extends Model<InterfaceOrdenItem, OrderItemCreationAttributes> 
    implements InterfaceOrdenItem 
{
    declare id: number;
    declare ordenId: number;
    declare productoId: number;
    declare cantidad: number;
    declare precioAlComprar: number;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

    static async findAllOrderItems(): Promise<OrderItemModel[]> {
        return await OrderItemModel.findAll();
    }
    
    static async findOrderItemById(id: number): Promise<OrderItemModel | null> {
        return await OrderItemModel.findByPk(id);
    }

    static async createOrderItem(orderItemInput: InputOrderItem): Promise<OrderItemModel> {
        return await OrderItemModel.create(orderItemInput);
    }

    static async updateOrderItem(id: number, updateData: Partial<InputOrderItem>): Promise<OrderItemModel | null> {
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
        id: { 
            type: DataTypes.INTEGER, 
            primaryKey: true, 
            autoIncrement: true 
        },
        ordenId: { 
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
        },
        precioAlComprar: { 
            type: DataTypes.DECIMAL(10, 2), // NUMERIC(10,2) en PostgreSQL
            allowNull: false 
        }
    },
    {
        sequelize,
        tableName: 'orden_items',
        timestamps: true,

        /*
        Nota de indexación: Contiene un índice único compuesto en `(ordenId, productoId)`. 
        Un mismo producto no puede aparecer en dos renglones distintos dentro de la misma orden.
        */
        indexes: [
            {
                unique: true,
                fields: ['ordenId', 'productoId'],
                name: 'idx_orden_producto_unique'
            }
        ]
    }
);