const { Categoria } = require('../models/index.model');

const crearCategoria = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'Fallo de integridad: Falta el parámetro nombre.' });
    }

    // Prevención de colisiones: El diccionario exige que el nombre sea Unique
    const existe = await Categoria.findOne({ where: { nombre } });
    if (existe) {
      return res.status(409).json({ error: 'Redundancia: El bloque de categoría ya existe.' });
    }

    const nuevaCategoria = await Categoria.create({ nombre });

    return res.status(201).json({
      message: 'Clúster de categoría instanciado.',
      categoria: nuevaCategoria
    });
  } catch (error) {
    console.error('Crash en crearCategoria:', error);
    return res.status(500).json({ error: 'Fallo de escritura en PostgreSQL.' });
  }
};

const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    return res.status(200).json({ categorias });
  } catch (error) {
    console.error('Crash en obtenerCategorias:', error);
    return res.status(500).json({ error: 'Fallo de lectura en memoria.' });
  }
};

module.exports = {
  crearCategoria,
  obtenerCategorias
};