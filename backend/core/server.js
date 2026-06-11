const express = require('express')
const cors = require('cors')
require('dotenv').config()
const errorHandler = require('../middleware/error-handler.middleware')
const { sequelize } = require('../models/index.model')
// const { establecerCardinalidad } = require('../models/cardinalidades.model')

class Server {
  constructor() {
    this.app = express()
    this.port = process.env.PORT || 3000
    this.connectToDataBase()
    this.middleware()
    this.rutas()
    this.errorHandlerGlobal()
  }

  // Configurar middleware
  middleware() {
    this.app.use(cors())
    this.app.use(express.json())
  }

  // Definir rutas
  rutas() {
    // this.app.use('/alumnos', require('../routes/alumno.routes'))
    
  }

  // Conectar a la base de datos y sincronizar modelos
  async connectToDataBase() {
    try {
      // establecerCardinalidad()
      console.log(
        'Cardinalidad y relaciones entre trablas establecidas correctamente'
      )

      await sequelize.sync({ alter: false })
      console.log('Database sincronizada correctamente')
    } catch (error) {
      console.error('Error en la conexión a la DB: ', error)
    }
  }

  // Manejo global de errores
  errorHandlerGlobal() {
    // Middleware para manejar rutas no encontradas (404)
    this.app.use((err, req, res, next) => {
      console.error(err.stack)
      return res.status(404).json({ msg: 'Error. Pagina no encontrada' })
    })
    // Middleware para manejar errores generales
    this.app.use(errorHandler)
  }

  // Iniciar el servidor
  listen() {
    this.app.listen(this.port, () => {
      console.log(`La API esta escuchando el el puerto: ${this.port}`)
    })
  }
}

module.exports = Server