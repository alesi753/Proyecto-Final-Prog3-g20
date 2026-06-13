
import { sequelize } from './index.model'
import { DataTypes, Model, Optional } from 'sequelize';

import { InterfaceUsuario, RolUsuario } from '../interfaces/usuario.interfaces';

// Definimos un tipo para la entrada de datos al crear un nuevo usuario, omitiendo el campo 'id' que se genera automáticamente
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


    // Obtener todos los usuarios
    static async findAllUsers(): Promise<UsuarioModel[]> {
        return await UsuarioModel.findAll()
    }
    
    // Buscar un usuario por su ID
    static async findById(id: number): Promise<UsuarioModel | null> {
        return await UsuarioModel.findByPk(id)
    }

    // Crear un nuevo usuario
    static async createUser(usuarioInput: InputUsuario): Promise<UsuarioModel> {
        return await UsuarioModel.create(usuarioInput)
    }

    // Actualizar un usuario existente
    static async updateUser(id: number, updateData: Partial<InputUsuario>): Promise<UsuarioModel | null> {
        // Primero buscamos al usuario
        const usuario = await UsuarioModel.findByPk(id);
        
        // Si no existe, retornamos null
        if (!usuario) return null;

        // Si existe, lo actualizamos y retornamos el objeto actualizado
        return await usuario.update(updateData);
    }

    // Eliminar un usuario por su ID
    static async deleteUser(id: number): Promise<boolean> {
        
        // destroy() retorna la cantidad de filas eliminadas
        const deletedRows = await UsuarioModel.destroy({
            where: { id }
        });

        // Retornamos true si se eliminó al menos una fila, false si no se encontró
        return deletedRows > 0;
    }
}

// Vinculación de la tabla SQL al modelo
UsuarioModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    apellido: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    correo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true // correo único
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    rol: {
      // Sequelize maneja los ENUM pasándole un array de strings con las opciones válidas
      type: DataTypes.ENUM('cliente', 'admin'),
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'usuarios', 
    timestamps: true       // createdAt y updatedAt
  }
)

