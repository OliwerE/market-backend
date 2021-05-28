/**
 * Module represents the listing router.
 */

import express from 'express'
import createError from 'http-errors'

import { ListingController } from '../controllers/ListingController.js'

export const router = express.Router()

const controller = new ListingController()

// OBS!! lägg till authCheck och isOwner

router.get('/sell', controller.getSellListings)
router.get('/buy', controller.getBuyListings)
router.get('/user', controller.getOwnListings) // is auth
router.get('/latest', controller.getLatestListings)

router.post('/create', controller.createListing) // is auth
router.post('/update/:id', controller.updateListing) // owner check

router.get('/:id', controller.getListingById)

router.delete('/delete/:id', controller.deleteListing) // isowner

router.use('*', (req, res, next) => next(createError(404)))
