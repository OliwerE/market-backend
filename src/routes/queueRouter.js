/**
 * Module represents the queue router.
 */

import express from 'express'
import createError from 'http-errors'

import { QueueController } from '../controllers/QueueController.js'

export const router = express.Router()

const controller = new QueueController()

router.get('/:id', controller.getQueueById)

router.use('*', (req, res, next) => next(createError(404)))