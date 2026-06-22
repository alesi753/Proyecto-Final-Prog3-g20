import { sequelize } from './index.model';
import { DataTypes, Model, Optional } from 'sequelize';
import { InterfaceMarca } from '../interfaces/marca.interfaces';

type InputMarca = Omit<InterfaceMarca, 'id'>;
interface MarcaCreationAttributes extends Optional<InterfaceMarca, 'id'> {}

export class MarcaModel
  extends Model<InterfaceMarca, MarcaCreationAttributes>
  implements InterfaceMarca
{
  declare id: number;
  declare nombre: string;

  static async findAllMarcas(): Promise<MarcaModel[]> {
    return await MarcaModel.findAll();
  }

  static async findMarcaById(id: number): Promise<MarcaModel | null> {
    return await MarcaModel.findByPk(id);
  }

  static async createMarca(input: InputMarca): Promise<MarcaModel> {
    return await MarcaModel.create(input);
  }

  static async updateMarca(
    id: number,
    updateData: Partial<InputMarca>
  ): Promise<MarcaModel | null> {
    const marca = await MarcaModel.findByPk(id);
    if (!marca) return null;
    return await marca.update(updateData);
  }

  static async deleteMarca(id: number): Promise<boolean> {
    const deletedRows = await MarcaModel.destroy({ where: { id } });
    return deletedRows > 0;
  }
}

MarcaModel.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  },
  {
    sequelize,
    tableName: 'marcas',
    timestamps: false,
  }
);
