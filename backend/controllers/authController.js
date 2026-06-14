const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_por_defecto';

const register = async (req, res) => {
  try {
    
    const { nombre, apellido, correo, password } = req.body;

    const existente = await User.findOne({ where: { correo } });
    if (existente) {
      return res.status(409).json({ error: 'Excepción de redundancia: El correo ya está registrado' });
    }

    
    const user = await User.create({ 
      nombre, 
      apellido, 
      correo, 
      password,
      rol: 'cliente' 
    });

    const token = jwt.sign({ id: user.id, rol: user.rol }, JWT_SECRET, { expiresIn: '24h' });

   
    return res.status(201).json({
      message: 'Usuario instanciado exitosamente',
      user: { id: user.id, nombre: user.nombre, correo: user.correo, rol: user.rol },
      token
    });
  } catch (error) {
    console.error('Crash en register:', error);
    return res.status(500).json({ error: 'Fallo de escritura en el servidor' });
  }
};

const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    const user = await User.findOne({ where: { correo } });
    if (!user) {
      return res.status(401).json({ error: 'Acceso denegado: Credenciales inválidas' });
    }

    
    const passwordValida = await user.validarPassword(password);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Acceso denegado: Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user.id, rol: user.rol }, JWT_SECRET, { expiresIn: '24h' });

    return res.status(200).json({
      message: 'Handshake exitoso',
      user: { id: user.id, nombre: user.nombre, correo: user.correo, rol: user.rol },
      token
    });
  } catch (error) {
    console.error('Crash en login:', error);
    return res.status(500).json({ error: 'Fallo de procesamiento lógico' });
  }
};

const perfil = async (req, res) => {
  try {
    
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'nombre', 'apellido', 'correo', 'rol'] // Select selectivo, excluye la password
    });

    if (!user) {
      return res.status(404).json({ error: 'Puntero nulo: Usuario no encontrado' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error('Crash en perfil:', error);
    return res.status(500).json({ error: 'Fallo de lectura en la base de datos' });
  }
};

module.exports = { register, login, perfil };