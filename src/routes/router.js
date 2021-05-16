/**
 * Module represents the main router.
 */

import express from 'express'
import createError from 'http-errors'

import { router as authRouter } from './authRouter.js'
import { router as listingRouter } from './listingRouter.js'
import { router as questionAnswerRouter } from './questionAnswerRouter.js'

export const router = express.Router()

router.get('/', (req, res, next) => res.json({message: 'Hello World!', status: 200}))
router.use('/auth', authRouter)
router.use('/listings', listingRouter)
router.use('/help', questionAnswerRouter)

router.use('*', (req, res, next) => next(createError(404)))