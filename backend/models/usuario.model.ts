import { sequelize } from './index.model';
import { DataTypes, Model, Optional } from 'sequelize';
import bcrypt from 'bcryptjs';
import { InterfaceUsuario, RolUsuario } from '../interfaces/usuario.interfaces';

type InputUsuario = Omit<InterfaceUsuario, 'id'>
interface UsuarioCreationAttributes extends Optional<InterfaceUsuario, 'id'> {}

export class UsuarioModel
    extends Model<InterfaceUsuario, UsuarioCreationAttributes> 
    implements InterfaceUsuario 
    {
    
    declare id: number
    declare nombre: string
    declare apellido: string
    declare correo: string
    declare password: string
    declare rol: RolUsuario
    declare readonly createdAt: Date
    declare readonly updatedAt: Date

    // Método de validación de password (exigido por el profe)
    async validarPassword(passwordTextoPlano: string): Promise<boolean> {
        return await bcrypt.compare(passwordTextoPlano, this.password);
    }

    static async findAllUsers(): Promise<UsuarioModel[]> {
        return await UsuarioModel.findAll()
    }
    
    static async findUserById(id: number): Promise<UsuarioModel | null> {
        return await UsuarioModel.findByPk(id)
    }

    // Buscar usuario por correo electrónico, método util para login y validaciones de unicidad
    static async findUserByEmail(correo: string): Promise<UsuarioModel | null> {
        return await UsuarioModel.findOne({ where: { correo } });
    }

    static async createUser(usuarioInput: InputUsuario): Promise<UsuarioModel> {
        return await UsuarioModel.create(usuarioInput)
    }

    static async updateUser(id: number, updateData: Partial<InputUsuario>): Promise<UsuarioModel | null> {
        const usuario = await UsuarioModel.findUserById(id);
        if (!usuario) return null;
        return await usuario.update(updateData);
    }

    static async deleteUser(id: number): Promise<boolean> {
        const deletedRows = await UsuarioModel.destroy({ where: { id } });
        return deletedRows > 0;
    }
}

UsuarioModel.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        nombre: { type: DataTypes.STRING(255), allowNull: false },
        apellido: { type: DataTypes.STRING(255), allowNull: false },
        correo: { type: DataTypes.STRING(255), allowNull: false, unique: true },
        password: { type: DataTypes.TEXT, allowNull: false },
        rol: { type: DataTypes.ENUM('cliente', 'admin'), allowNull: false }
    },
    {
        sequelize,
        tableName: 'usuarios', 
        timestamps: true,
        hooks: {
            // Hook de seguridad - CREACIÓN
            beforeCreate: async (usuario: UsuarioModel) => {
                const salt = await bcrypt.genSalt(10);
                usuario.password = await bcrypt.hash(usuario.password, salt);
            },
            // Hook de seguridad - ACTUALIZACIÓN
            beforeUpdate: async (usuario: UsuarioModel) => {
                // Solo hashear de nuevo si el campo password fue modificado
                if (usuario.changed('password')) {
                    const salt = await bcrypt.genSalt(10);
                    usuario.password = await bcrypt.hash(usuario.password, salt);
                }
            }
        }
    }
)