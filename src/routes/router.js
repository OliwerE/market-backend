/**
 * Module represents the main router.
 */

import express from 'express'
import createError from 'http-errors'
import { router as authRouter } from './authRouter.js'
import { router as listingRouter } from './listingRouter.js'
import { router as questionAnswerRouter } from './questionAnswerRouter.js'
import { router as queueRouter } from './queueRouter.js'

export const router = express.Router()

router.use('/auth', authRouter)
router.use('/listings', listingRouter)
router.use('/queue', queueRouter)
router.use('/help', questionAnswerRouter)

router.use('*', (req, res, next) => next(createError(404)))
