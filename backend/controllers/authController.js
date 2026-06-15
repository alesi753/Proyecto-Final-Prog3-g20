const { User } = require('../models/index.model');
const { generarToken } = require('../middleware/auth.js');

const register = async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;

    const newUser = await User.create({ nombre, correo, password });
    const userResponse = { id: newUser.id, nombre: newUser.nombre, correo: newUser.correo };

    return res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: userResponse,
      token: generarToken(newUser)
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return res.status(500).json({ message: 'Error al procesar registro de usuario.' });
  }
};

const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    // Búsqueda por correo
    const user = await User.findOne({ where: { correo } });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const passwordValida = await user.validarPassword(password);
    if (!passwordValida) {
      return res.status(401).json({ message: 'Contraseña incorrecta.' });
    }

    const userResponse = { id: user.id, nombre: user.nombre, correo: user.correo };

    return res.status(200).json({
      message: "Login exitoso",
      user: userResponse,
      token: generarToken(user)
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ message: 'Error al procesar lectura de inicio de sesión.' });
  }
};

const perfil = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] } 
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error en perfil:', error);
    return res.status(500).json({ message: 'Error al procesar lectura de perfil.' });
  }
};

module.exports = { register, login, perfil };