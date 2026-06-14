const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: true // Agregado para respetar el DER
    },
    correo: {
      type: DataTypes.STRING, // Variable sincronizada con la base de datos
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rol: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'cliente' // Agregado para respetar el DER
    }
  }, {
    hooks: {
      // TODO 1 - Hook beforeCreate: Hashear la password antes de guardar
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });

  // TODO 2 - Método validarPassword: Compara texto plano con el hash almacenado
  User.prototype.validarPassword = async function(passwordTextoPlano) {
    return await bcrypt.compare(passwordTextoPlano, this.password);
  };

  return User;
};