import { sequelize } from './index.model';
import { DataTypes, Model, Optional } from 'sequelize';
import { InterfaceProducto } from '../interfaces/producto.interfaces';

type ProductoModelAttributes = Omit<InterfaceProducto, 'createdAt' | 'updatedAt'>;
type ProductCreationAttributes = Optional<ProductoModelAttributes, 'id'>;

export class ProductoModel
  extends Model<ProductoModelAttributes, ProductCreationAttributes>
  implements InterfaceProducto {
  declare id: number;
  declare categoriaId: number;
  declare marcaId: number;
  declare modelo: string;
  declare precio: number;
  declare stock: number;
  declare especificaciones: Record<string, any>;

  static async findAllProducts(): Promise<ProductoModel[]> {
    return await ProductoModel.findAll();
  }

  static async findProductById(id: number): Promise<ProductoModel | null> {
    return await ProductoModel.findByPk(id);
  }

  static async createProduct(productInput: ProductCreationAttributes): Promise<ProductoModel> {
    return await ProductoModel.create(productInput);
  }

  static async updateProduct(id: number, updateData: Partial<ProductoModelAttributes>): Promise<ProductoModel | null> {
    const product = await ProductoModel.findByPk(id);
    if (!product) return null;
    return await product.update(updateData);
  }

  static async deleteProduct(id: number): Promise<boolean> {
    const deletedRows = await ProductoModel.destroy({ where: { id } });
    return deletedRows > 0;
  }

  static async checkStock(id: number, cantidad: number): Promise<boolean> {
    const product = await ProductoModel.findByPk(id);
    if (!product) return false;
    return product.stock >= cantidad;
  }
}

ProductoModel.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    categoriaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'categorias', key: 'id' }
    },
    marcaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'marcas', key: 'id' }
    },
    modelo: { type: DataTypes.STRING(255), allowNull: false },
    precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false },
    especificaciones: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {}
    }
  },
  {
    sequelize,
    tableName: 'productos',
    timestamps: false
  }
);
