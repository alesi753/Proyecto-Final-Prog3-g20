const { Carrito, CarritoItem, Producto } = require('../models/index.model');

const obtenerCarrito = async (req, res) => {
  try {
    // req.user.id viene inyectado por tu escudo JWT
    const usuarioId = req.user.id;

    // Buscamos el carrito activo del usuario y hacemos un JOIN con los productos
    const [carrito] = await Carrito.findOrCreate({
      where: { usuarioId },
      include: [{
        model: Producto,
        as: 'productos', // Ajustá este alias según cómo definiste tus asociaciones en index.model.js
        through: { attributes: ['cantidad'] }
      }]
    });

    return res.status(200).json({ carrito });
  } catch (error) {
    console.error('Crash en obtenerCarrito:', error);
    return res.status(500).json({ error: 'Fallo de lectura transaccional.' });
  }
};

const agregarItem = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const { productoId, cantidad } = req.body;

    // 1. Validación cruda de entrada
    if (!productoId || !cantidad || cantidad <= 0) {
      return res.status(400).json({ error: 'Fallo de integridad: Parámetros inválidos o cantidad negativa.' });
    }

    // 2. Validación de Stock Físico (Tu barra de seguridad)
    const producto = await Producto.findByPk(productoId);
    if (!producto) {
      return res.status(404).json({ error: 'Puntero nulo: El hardware no existe.' });
    }
    if (producto.stock < cantidad) {
      return res.status(409).json({ error: `Excepción de inventario: Stock insuficiente. Disponible: ${producto.stock}` });
    }

    // 3. Instanciamos el carrito si no existe
    const [carrito] = await Carrito.findOrCreate({ where: { usuarioId } });

    // 4. Verificamos si el producto ya está en el carrito para sumar o crear el registro
    const itemExistente = await CarritoItem.findOne({
      where: { carritoId: carrito.id, productoId }
    });

    if (itemExistente) {
      const nuevaCantidad = itemExistente.cantidad + cantidad;
      if (producto.stock < nuevaCantidad) {
        return res.status(409).json({ error: 'Excepción de inventario: La suma supera el stock físico.' });
      }
      await itemExistente.update({ cantidad: nuevaCantidad });
    } else {
      await CarritoItem.create({
        carritoId: carrito.id,
        productoId,
        cantidad
      });
    }

    return res.status(200).json({ message: 'Hardware asignado al bloque de memoria del carrito.' });
  } catch (error) {
    console.error('Crash en agregarItem:', error);
    return res.status(500).json({ error: 'Fallo de escritura transaccional.' });
  }
};

const eliminarItem = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const { productoId } = req.params;

    const carrito = await Carrito.findOne({ where: { usuarioId } });
    if (!carrito) {
      return res.status(404).json({ error: 'Memoria vacía: Carrito no inicializado.' });
    }

    const item = await CarritoItem.findOne({
      where: { carritoId: carrito.id, productoId }
    });

    if (!item) {
      return res.status(404).json({ error: 'Puntero nulo: Hardware no encontrado en el carrito.' });
    }

    // Baja física del renglón (Acá sí usamos destroy porque es una tabla pivote volátil, no histórico)
    await item.destroy();

    return res.status(200).json({ message: 'Hardware purgado del carrito.' });
  } catch (error) {
    console.error('Crash en eliminarItem:', error);
    return res.status(500).json({ error: 'Fallo al purgar memoria del servidor.' });
  }
};

module.exports = {
  obtenerCarrito,
  agregarItem,
  eliminarItem
};