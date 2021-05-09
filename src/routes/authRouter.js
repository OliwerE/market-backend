/**
 * Module represents the auth router.
 */

import express from 'express'
import createError from 'http-errors'

import { AuthController } from '../controllers/AuthController.js'

export const router = express.Router()

const controller = new AuthController()

router.get('/', (req, res, next) => res.json({message: 'Auth router', status: 200}))

router.get('/username', controller.getUsername)

router.post('/login', controller.postLogin)
router.post('/register', controller.postRegister)
router.post('/logout', controller.logout)


router.get('/profile', controller.getUserProfile) // Lägg till auth check!
router.post('/profile', controller.postUpdateProfile) // lägg till auth check??

router.get('/check', controller.checkLoggedIn) // TEMP!

router.use('*', (req, res, next) => next(createError(404)))