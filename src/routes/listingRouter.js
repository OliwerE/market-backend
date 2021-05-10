/**
 * Module represents the listing router.
 */

import express from 'express'
import createError from 'http-errors'

import { ListingController } from '../controllers/ListingController.js'

export const router = express.Router()

const controller = new ListingController()

router.get('/sell', controller.getSellListings)

router.post('/create', controller.createListing)


router.use('*', (req, res, next) => next(createError(404)))