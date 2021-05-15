
import express from 'express'
import helmet from 'helmet'
import logger from 'morgan'
import cors from 'cors'
import { router } from './routes/router.js'
import { connectDB } from './config/mongoose.js'
// import bodyParser from 'body-parser'

const server = async () => {
  const app = express()

  await connectDB(app)

  app.use(helmet())
  // app.use(cors())
  app.use(cors({ origin: process.env.ORIGIN, credentials: true }));
  app.use(logger('dev'))
  
  
  // app.use(express.urlencoded()) // fungerar nästan
  app.use(express.json()) // anv?
  
  // app.use(express.bodyParser()); // funk ej

  // app.use(express.urlencoded({ extended: false })) // funkar men fel

  // app.use(express.urlencoded());

  // app.use(function(req, res, next) {
  //   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  //   res.header('Access-Control-Allow-Credentials','true')
  //   next();
  // });

  app.use('/', router)

  app.use((err, req, res, next) => {
    if (err.status === 404) {
      return res.status(404).json({message: 'Not Found', status: 404})
    }
    if (err.status === 500) {
      return res.status(500).json({message: 'Internal Server Error', status: 500})
    }
  })

  app.listen(process.env.PORT, () => {
    console.log(`Listens for localhost@${process.env.PORT}`)
    console.log('ctrl + c to terminate')
  })

}

server()