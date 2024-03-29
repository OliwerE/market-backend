/**
 * Module represents the question and answer router.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import createError from 'http-errors'

import { QuestionAnswerController } from '../controllers/QuestionAnswerController.js'

export const router = express.Router()

const controller = new QuestionAnswerController()

router.get('/questions', controller.getQuestionAndAnswer)

router.use('*', (req, res, next) => next(createError(404)))
