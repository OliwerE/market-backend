/**
 * Module represents the main router.
 */

import express from 'express'
import createError from 'http-errors'

export const router = express.Router()

router.get('/', (req, res, next) => res.json({message: 'Hello World', status: 200}))

router.use('*', (req, res, next) => next(createError(404)))
