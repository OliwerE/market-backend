
import express from 'express'
import helmet from 'helmet'
import logger from 'morgan'
import cors from 'cors'
import { router } from './routes/router.js'
import { connectDB } from './config/mongoose.js'
// import bodyParser from 'body-parser'
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
  app.use(express.json({ limit: '5MB' })) // bestäm limit!
  app.use(logger('dev'))

  // app.use(express.urlencoded()) // fungerar nästag
  app.use(express.json()) // anv?

  // app.use(express.bodyParser()) // funk ej

  // app.use(express.urlencoded({ extended: false })) // funkar men fel

  // app.use(express.urlencoded());

  // app.use(function(req, res, next) {
  //   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  //   res.header('Access-Control-Allow-Credentials','true')
  //   next();
  // });

  // app.use(csurf({})) // OBS MÅSTE ANVÄNDAS I PROD!  <--- !!!!

  // app.use((req, res, next) => {
  //   res.cookie('XSRF-TOKEN', req.csrfToken()) // Creates new csrf token on each request.
  //   return next()
  // })

  /*
  // Csurf token errors.
  app.use((err, req, res, next) => {
    if (err.code !== 'EBADCSRFTOKEN') return next(err)
    console.log(err)
    console.log(req)
    console.log(err.code)
    console.log(req.headers['csrf-token'])
    res.status(403).json({ msg: 'csurf token not valid' })
  })
  */

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
