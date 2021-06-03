/**
 * Module represents the queue controller.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

import { Listing } from '../models/listing-model.js'
import { User } from '../models/user-model.js'

/**
 * Class represents a controller used to render pages for users.
 */
export class QueueController {
  async getListingQueueById (req, res, next) {
    try {
      const foundQueue = (await Listing.find({ _id: req.params.id })).map(L => ({
        queue: L.queue,
        owner: L.owner
      }))

      const resObj = {
        queue: foundQueue[0].queue,
        isOwner: (req.session.user === foundQueue[0].owner ? true : false)
      }

      if (foundQueue[0].queue.indexOf(req.session.user) >= 0) { // if session user exist in queue
        resObj.isInQueue = true
        resObj.placeInQueue = foundQueue[0].queue.indexOf(req.session.user) + 1
      } else {
        resObj.isInQueue = false
      }
      res.json(resObj)
    } catch (err) {
      res.status(500).json({ msg: 'Internal Server Error', status: 500 })
    }
  }

  async joinListingQueueById (req, res, next) {
    try {
      const db = (await Listing.find({ _id: req.params.id })).map(L => ({
        queue: L.queue
      }))
      db[0].queue.push(req.session.user) // Adds current user to queue

      await Listing.updateOne({ _id: req.params.id }, { queue: db[0].queue })

      res.status(200).json({ msg: 'User added to queue', status: 200 })
    } catch (err) {
      res.status(500).json({ msg: 'Internal Server Error', status: 500 })
    }
  }  

  async leaveListingQueueById (req, res, next) {
    try {
      const db = (await Listing.find({ _id: req.params.id })).map(L => ({
        queue: L.queue
      }))

      const indexToRemove = db[0].queue.indexOf(req.session.user)
      if (indexToRemove > -1) {
        db[0].queue.splice(indexToRemove, 1)
      } else {
        res.status(404).json({ msg: 'User not in queue', status: 404 })
      }

      await Listing.updateOne({ _id: req.params.id }, { queue: db[0].queue })

      res.status(200).json({ msg: 'User removed from queue', status: 200 })
    } catch (err) {
      res.status(500).json({ msg: 'Internal Server Error', status: 500 })
    }
  }

  async getListingQueueByIdAsOwner (req, res, next) {
    try {
      const db = (await Listing.find({ _id: req.params.id })).map(L => ({
        queue: L.queue
      }))
      const users = db[0].queue
      const queueUserDetails = []

      for (let i = 0; i < users.length; i++) {
        const db = (await User.find({ username: users[i] })).map(U => ({
          username: U.username,
          email: U.email,
          phoneNumber: U.phoneNumber
        }))
        queueUserDetails.push(db[0])
      }

      res.status(200).json({queueUserDetails})
    } catch (err) {
      res.status(500).json({ msg: 'Internal Server Error', status: 500 })
    }
  }
}