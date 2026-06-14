const { sequelize, Orden, OrdenItem, Carrito, CarritoItem, Producto } = require('../models/index.model');

const procesarCheckout = async (req, res) => {
  // Apertura de bloque transaccional: Todo o nada.
  const t = await sequelize.transaction();

  try {
    const usuarioId = req.user.id;

    // 1. Lectura del estado de memoria del carrito
    const carrito = await Carrito.findOne({
      where: { usuarioId },
      include: [{
        model: Producto,
        as: 'productos', 
        through: { attributes: ['cantidad'] }
      }],
      transaction: t
    });

    if (!carrito || !carrito.productos || carrito.productos.length === 0) {
      await t.rollback();
      return res.status(400).json({ error: 'Excepción de ejecución: El carrito está vacío.' });
    }

    // 2. Cálculo del Total y Validación Estricta de Stock
    let totalOrden = 0;
    const itemsProcesados = [];

    for (const producto of carrito.productos) {
      const cantidadSolicitada = producto.CarritoItem.cantidad;

      if (producto.stock < cantidadSolicitada) {
        await t.rollback();
        return res.status(409).json({ 
          error: `Excepción de inventario: Stock insuficiente para [${producto.nombre}]. Disponible: ${producto.stock}` 
        });
      }

      totalOrden += producto.precio * cantidadSolicitada;

      itemsProcesados.push({
        productoId: producto.id,
        cantidad: cantidadSolicitada,
        precioAlComprar: producto.precio // Congelamiento del log financiero (evita inflación retrospectiva)
      });
    }

    // 3. Generación del Registro Histórico (Orden) - PARCHE DE ESQUEMA APLICADO AQUÍ
    const nuevaOrden = await Orden.create({
      usuarioId,
      precioTotal: totalOrden, // <-- Clave corregida para machear con el DER
      estado: 'pendiente' 
    }, { transaction: t });

    // 4. Inyección del detalle de la orden con el ID recién generado
    const ordenItemsData = itemsProcesados.map(item => ({
      ordenId: nuevaOrden.id,
      ...item
    }));
    await OrdenItem.bulkCreate(ordenItemsData, { transaction: t });

    // 5. Deducción del Stock Físico en el Catálogo
    for (const item of itemsProcesados) {
      const productoDb = await Producto.findByPk(item.productoId, { transaction: t });
      await productoDb.update({
        stock: productoDb.stock - item.cantidad
      }, { transaction: t });
    }

    // 6. Purgado de Memoria Volátil (Limpieza del Carrito)
    await CarritoItem.destroy({
      where: { carritoId: carrito.id },
      transaction: t
    });

    // 7. Commit Transaccional: Se consolida la escritura en disco
    await t.commit();

    return res.status(201).json({
      message: 'Checkout ejecutado con éxito. Transacción completada.',
      orden: nuevaOrden
    });

  } catch (error) {
    // Si cualquier operación del bloque try crashea, se deshace TODO.
    await t.rollback();
    console.error('Crash fatal en procesarCheckout:', error);
    return res.status(500).json({ error: 'Fallo catastrófico en el motor de pagos. Transacción abortada.' });
  }
};

const obtenerHistorialOrdenes = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const ordenes = await Orden.findAll({
      where: { usuarioId },
      include: [{
        model: OrdenItem,
        as: 'items' 
      }]
    });

    return res.status(200).json({ ordenes });
  } catch (error) {
    console.error('Crash en obtenerHistorialOrdenes:', error);
    return res.status(500).json({ error: 'Fallo de lectura del historial contable.' });
  }
};

module.exports = {
  procesarCheckout,
  obtenerHistorialOrdenes
};