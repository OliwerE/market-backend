
import express from 'express'
import helmet from 'helmet'
import logger from 'morgan'
import { router } from './routes/router.js'
import { connectDB } from './config/mongoose.js'

const server = async () => {
  const app = express()

  await connectDB(app)

  app.use(helmet())
  app.use(logger('dev'))
  app.use(express.json())

  app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
next();
});

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