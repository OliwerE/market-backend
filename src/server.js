
import express from 'express'
import helmet from 'helmet'
import logger from 'morgan'
import cors from 'cors'
import { router } from './routes/router.js'
import { connectDB } from './config/mongoose.js'
import csurf from 'csurf'

/**
 * Starts the express server.
 */
const server = async () => {
  const app = express()
  await connectDB(app)
  app.use(helmet())
  app.set('trust proxy', 1)
  app.use(cors({ origin: process.env.ORIGIN, credentials: true }))
  app.use(express.json({ limit: '10MB' }))
  app.use(logger('dev'))
  app.use(express.json())
  app.use(csurf({}))

  // Csurf token errors.
  app.use((err, req, res, next) => {
    if (err.code !== 'EBADCSRFTOKEN') return next(err) // Invalid csrf token
    res.status(403).json({ reason: 'csrfToken-invalid' })
  })

  app.use('/', router)

  app.use((err, req, res, next) => {
    if (err.status === 404) {
      return res.status(404).json({ message: 'Not Found', status: 404 })
    }
    if (err.status === 500) {
      return res.status(500).json({ message: 'Internal Server Error', status: 500 })
    }
  })

  app.listen(process.env.PORT, () => {
    console.log(`Listens for localhost@${process.env.PORT}`)
    console.log('ctrl + c to terminate')
  })
}

server()
