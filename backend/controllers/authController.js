const { User } = require('../models/index.js');
const { generarToken } = require('../middleware/auth.js');

const register = async (req, res) => {
  try {
    //Alineado al DER (correo en lugar de email)
    const { nombre, correo, password } = req.body;

    const newUser = await User.create({ nombre, correo, password });

    const userResponse = { id: newUser.id, nombre: newUser.nombre, correo: newUser.correo };

    return res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: userResponse,
      token: generarToken(newUser)
    });
  } catch (error) {
    console.error('Crash en register:', error);
    return res.status(500).json({ message: 'Fallo de integridad en el registro.' });
  }
};

const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    // Búsqueda por correo
    const user = await User.findOne({ where: { correo } });
    if (!user) {
      return res.status(404).json({ message: 'Credenciales inválidas (Puntero Nulo).' });
    }

    const passwordValida = await user.validarPassword(password);
    if (!passwordValida) {
      return res.status(401).json({ message: 'Credenciales inválidas (Hash incorrecto).' });
    }

    const userResponse = { id: user.id, nombre: user.nombre, correo: user.correo };

    return res.status(200).json({
      message: "Login exitoso",
      user: userResponse,
      token: generarToken(user)
    });
  } catch (error) {
    console.error('Crash en login:', error);
    return res.status(500).json({ message: 'Fallo de lectura transaccional en login.' });
  }
};

const perfil = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] } 
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado en el clúster.' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Crash en perfil:', error);
    return res.status(500).json({ message: 'Fallo al procesar lectura de perfil.' });
  }
};

module.exports = { register, login, perfil };