const express = require('express')
const cors = require('cors')
require('dotenv').config()
const errorHandler = require('../middleware/error-handler.middleware')
const { sequelize } = require('../models/index.model')


import { configurarCardinalidades } from './models/cardinalidades';

class Server {
  constructor() {
    this.app = express()
    // Puerto 3001 asignado por defecto para aislar la ejecución de React
    this.port = process.env.PORT || 3001
    this.connectToDataBase()
    this.middleware()
    this.rutas()
    this.errorHandlerGlobal()
  }

  middleware() {
    this.app.use(cors())
    this.app.use(express.json())
  }

  rutas() {
    // Montaje del cableado lógico. Se exponen los controladores a la red.
    this.app.use('/api/auth', require('../routes/auth.js'))
    this.app.use('/api/categorias', require('../routes/categoria.routes.js'))
    this.app.use('/api/productos', require('../routes/producto.routes.js'))
    this.app.use('/api/carrito', require('../routes/carrito.routes.js'))
    this.app.use('/api/ordenes', require('../routes/orden.routes.js'))
  }

  async connectToDataBase() {
    try {

      // Ejecutar las relaciones ANTES del sync
      configurarCardinalidades();

      await sequelize.sync({ alter: false })
      console.log('Conexión física a PostgreSQL establecida. Modelos sincronizados.')
    } catch (error) {
      console.error('Crash fatal en la conexión a la base de datos: ', error)
    }
  }

  errorHandlerGlobal() {
    // Filtro 404 estricto (Debe tener 3 parámetros exactos)
    this.app.use((req, res, next) => {
      return res.status(404).json({ msg: 'Interrupción: Endpoint no encontrado (404).' })
    })
    
    // Filtro de excepciones globales del procesador (Debe tener 4 parámetros)
    this.app.use(errorHandler)
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Clúster Backend operando estable en el puerto: ${this.port}`)
    })
  }
}

module.exports = Server