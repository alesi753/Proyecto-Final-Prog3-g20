import { sequelize } from './index.model';
import { DataTypes, Model, Optional } from 'sequelize';
import { InterfaceOrden, EstadoOrden } from '../interfaces/orden.interfaces';

// Omitimos 'id' y 'fechaCreacion', y el atributo 'estado' se vuelve opcional (podemos omitirlo al crear una orden, y se asumirá que es 'pendiente' por defecto)
type InputOrder = Omit<InterfaceOrden, 'id' | 'estado' | 'fechaCreacion'> & {
  estado?: EstadoOrden;
};

interface OrderCreationAttributes extends Optional<
  InterfaceOrden,
  'id' | 'estado' | 'fechaCreacion'
> {}

export class OrdenModel
  extends Model<InterfaceOrden, OrderCreationAttributes>
  implements InterfaceOrden
{
  declare id: number;
  declare usuarioId: number;
  declare precioTotal: number;
  declare estado: EstadoOrden;
  declare readonly fechaCreacion: Date;

  static async findAllOrders(): Promise<OrdenModel[]> {
    return await OrdenModel.findAll();
  }

  // Busca todas las órdenes que pertenecen a un usuario específico
  // e incluye los items de cada orden para poder consultar el historial completo
  static async findAllOrdersByUserIdWithItems(
    usuarioId: number
  ): Promise<OrdenModel[]> {
    return await OrdenModel.findAll({
      where: { usuarioId },
      include: [
        {
          // Incluye los items asociados a cada orden. Usando el alias definido en la relación entre OrdenModel y OrderItemModel en cardinalidades.model.ts
          association: 'items',
        },
      ],
    });
  }

  static async findOrderById(id: number): Promise<OrdenModel | null> {
    return await OrdenModel.findByPk(id);
  }

  // Crea una nueva orden
  // Permite recibir una transacción para usarla al momento de confirmar la compra
  static async createOrder(
    orderInput: InputOrder,
    transaction?: any
  ): Promise<OrdenModel> {
    return await OrdenModel.create(orderInput, { transaction });
  }

  // Actualiza una orden existente por id
  // Permite usar una transacción si la actualización forma parte de otra operación más grande
  static async updateOrder(
    id: number,
    updateData: Partial<InputOrder>,
    transaction?: any
  ): Promise<OrdenModel | null> {
    const order = await OrdenModel.findByPk(id, { transaction });
    if (!order) return null;
    return await order.update(updateData, { transaction });
  }

  // Elimina una orden por id
  // Permite usar una transacción si el borrado se realiza junto con otros cambios
  static async deleteOrder(id: number, transaction?: any): Promise<boolean> {
    const deletedRows = await OrdenModel.destroy({
      where: { id },
      transaction,
    });
    return deletedRows > 0;
  }
}

OrdenModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'usuarios', key: 'id' },
    },
    precioTotal: {
      type: DataTypes.DECIMAL(10, 2), // NUMERIC(10,2) en PostgreSQL
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM(
        'pendiente',
        'pagado',
        'preparando',
        'enviado',
        'entregado',
        'cancelado'
      ),
      allowNull: false,
      defaultValue: 'pendiente',
    },
    fechaCreacion: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'ordenes',
    timestamps: true,
    updatedAt: false, // Desactivamos updatedAt
    createdAt: 'fechaCreacion', // Usamos la columna fechaCreacion en vez de createdAt
  }
);
