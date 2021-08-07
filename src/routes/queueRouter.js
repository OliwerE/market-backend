/**
 * Module represents the queue router.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import createError from 'http-errors'
import { Listing } from '../models/listing-model.js'
import { QueueController } from '../controllers/QueueController.js'

export const router = express.Router()

const controller = new QueueController()

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

/**
 * Checks if a user is logged in.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {Function} next - Next function.
 * @returns {JSON} - Response data.
 */
const notOwner = async (req, res, next) => {
  try {
    const db = (await Listing.find({ _id: req.params.id })).map(L => ({
      owner: L.owner
    }))
    if (db[0].owner !== req.session.user) {
      next()
    } else {
      return res.status(401).json({ msg: 'Owner not allowed', status: 401 })
    }
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error', status: 500 })
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
    // find listing
    const listing = (await Listing.find({ _id: req.params.id })).map(L => ({
      owner: L.owner
    }))

    if (req.session.user === listing[0].owner) {
      next()
    } else {
      return res.status(401).json({ msg: 'Unauthorized: not owner', status: 401 })
    }
  } catch (err) {
    return res.status(500).json({ msg: 'Internal Server Error', status: 500 })
  }
}

router.get('/inqueue', authorizeRequest, controller.getUserInQueueListings)
router.delete('/owner/remove/:id', authorizeRequest, isOwner, controller.ownerRemoveUserFromListingQueue)
router.post('/join/:id', authorizeRequest, notOwner, controller.joinListingQueueById)
router.delete('/leave/:id', authorizeRequest, notOwner, controller.leaveListingQueueById)
router.get('/:id', controller.getListingQueueById)
router.get('/owner/:id', authorizeRequest, isOwner, controller.getListingQueueByIdAsOwner)

router.use('*', (req, res, next) => next(createError(404)))
