/**
 * Module represents the listing router.
 */

import express from 'express'
import createError from 'http-errors'

import { ListingController } from '../controllers/ListingController.js'
import { Listing } from '../models/listing-model.js'

export const router = express.Router()

const controller = new ListingController()

/**
 * Checks if a user is logged in.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {Function} next - Next function.
 * @returns {JSON} - Response data.
 */
const authorizeRequest = (req, res, next) => {
  if (req.session.user) {
    next()
  } else {
    return res.status(401).json({ msg: 'Unauthorized: User not logged in!', status: 401 })
  }
}

/**
 * Checks if a user is the owner.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {Function} next - Next function.
 * @returns {JSON} - Response data.
 */
const isOwner = async (req, res, next) => {
  try {
    //find listing
    const listing = (await Listing.find({ _id: req.params.id })).map(L => ({
      owner: L.owner,
    }))

    if (req.session.user === listing[0].owner) {
      next()
    } else {
      return res.status(401).json({ msg: 'Unauthorized: not owner', status: 401 })
    }
  } catch (err) { // OBS not found blir också 500, ska vara 404!
    return res.status(500).json({ msg: 'Internal Server Error', status: 500 })
  } 
}

router.get('/sell', controller.getSellListings)
router.get('/buy', controller.getBuyListings)
router.get('/user', authorizeRequest, controller.getOwnListings)
router.get('/latest', controller.getLatestListings)

router.get('/search', controller.searchListings)

router.post('/create', authorizeRequest, controller.createListing)

router.post('/update/:id', authorizeRequest, isOwner, controller.updateListing)

router.get('/auth/:id', authorizeRequest, isOwner, controller.getListingById) // Not protected, used to help client authorize
router.get('/:id', controller.getListingById)

router.delete('/delete/:id', authorizeRequest, isOwner, controller.deleteListing)

router.use('*', (req, res, next) => next(createError(404)))
