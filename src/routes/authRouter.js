/**
 * Module represents the auth router.
 */

import express from 'express'
import createError from 'http-errors'

import { AuthController } from '../controllers/AuthController.js'

export const router = express.Router()

const controller = new AuthController()

/**
 * Checks if a user is logged in.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {Function} next - Next function.
 * @returns {JSON} - Response data.
 */
const authorizeRequest = (req, res, next) => {
  console.log(req.session.user)

  if (req.session.user) {
    next()
  } else {
    return res.status(401).json({ msg: 'user not logged in!', isAuth: false, status: 401 })
  }
}

router.get('/', (req, res, next) => res.json({ message: 'Auth router', status: 200 }))

router.get('/username', authorizeRequest, controller.getUsername)

router.get('/csurf', controller.getCsrfToken) // OBS denna route används ej nu pga alla get får ny token i server.js! byt till denna??

router.post('/login', controller.postLogin)
router.post('/register', controller.postRegister)
router.post('/logout', authorizeRequest, controller.logout)

router.get('/profile', authorizeRequest, controller.getUserProfile)
router.post('/profile', authorizeRequest, controller.postUpdateProfile)

router.get('/check', controller.checkLoggedIn)

router.use('*', (req, res, next) => next(createError(404)))
