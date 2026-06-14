const { Producto } = require('../models/index.model');

const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, marca, precio, stock, especificaciones, categoriaId } = req.body;

    if (!nombre || !precio || !categoriaId) {
      return res.status(400).json({ error: 'Fallo de integridad: Parámetros obligatorios faltantes.' });
    }

    const nuevoProducto = await Producto.create({
      nombre,
      descripcion,
      marca,
      precio,
      stock,
      especificaciones,
      categoriaId,
      activo: true // Nacimiento con baja lógica en false
    });

    return res.status(201).json({
      message: 'Hardware catalogado exitosamente.',
      producto: nuevoProducto
    });
  } catch (error) {
    console.error('Crash en crearProducto:', error);
    return res.status(500).json({ error: 'Fallo de escritura en PostgreSQL.' });
  }
};

const obtenerProductosActivos = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      where: { activo: true } // Filtro estricto de catálogo activo
    });

    return res.status(200).json({ productos });
  } catch (error) {
    console.error('Crash en obtenerProductos:', error);
    return res.status(500).json({ error: 'Fallo de lectura en memoria.' });
  }
};

const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ error: 'Puntero nulo: Componente no encontrado.' });
    }

    await producto.update(updateData);

    return res.status(200).json({
      message: 'Parámetros del hardware actualizados.',
      producto
    });
  } catch (error) {
    console.error('Crash en actualizarProducto:', error);
    return res.status(500).json({ error: 'Fallo de I/O en actualización.' });
  }
};

const eliminarProductoLogico = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ error: 'Puntero nulo: Componente no encontrado.' });
    }

    // Baja Lógica: Alteración de estado sin borrado físico
    await producto.update({ activo: false });

    return res.status(200).json({ message: 'Componente deprecado correctamente.' });
  } catch (error) {
    console.error('Crash en eliminarProducto:', error);
    return res.status(500).json({ error: 'Fallo al alterar el estado de memoria.' });
  }
};

module.exports = {
  crearProducto,
  obtenerProductosActivos,
  actualizarProducto,
  eliminarProductoLogico
};