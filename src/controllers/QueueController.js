import { Listing } from '../models/listing-model.js'
import { User } from '../models/user-model.js'

/**
 * Class represents a controller used to render pages for users.
 */
export class QueueController {
  /**
   * Get listings where the user is in queue.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   * @returns {JSON} - Response data.
   */
  async getUserInQueueListings (req, res, next) {
    try {
      const pageSize = 8
      const page = parseInt(req.query.page || 0) // First 8 if no query.

      const foundListings = (await Listing.find({ queue: req.session.user }).sort({ _id: -1 }).limit(pageSize).skip(pageSize * page)).map(L => ({
        id: L._id,
        title: L.title,
        listingType: L.listingType,
        productImage: L.productImage,
        description: L.description,
        category: L.category,
        price: L.price
      }))

      const totalListings = await Listing.countDocuments({ queue: req.session.user })
      const totalPages = Math.ceil(totalListings / pageSize)

      res.status(200).json({ totalPages, foundListings })
    } catch (err) {
      res.status(500).json({ msg: 'Internal Server Error', status: 500 })
    }
  }

  /**
   * Get listing queue.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   * @returns {JSON} - Response data.
   */
  async getListingQueueById (req, res, next) {
    try {
      const foundQueue = (await Listing.find({ _id: req.params.id })).map(L => ({
        queue: L.queue,
        owner: L.owner
      }))

      const resObj = {
        queue: foundQueue[0].queue,
        isOwner: (req.session.user === foundQueue[0].owner)
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

  /**
   * Add user to listing queue.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   * @returns {JSON} - Response data.
   */
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

  /**
   * Remove user from listing queue.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   * @returns {JSON} - Response data.
   */
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

  /**
   * Get listing queue with contact details.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   * @returns {JSON} - Response data.
   */
  async getListingQueueByIdAsOwner (req, res, next) {
    try {
      const db = (await Listing.find({ _id: req.params.id })).map(L => ({
        queue: L.queue,
        title: L.title
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

      const data = {
        title: db[0].title,
        queueUserDetails
      }

      res.status(200).json(data)
    } catch (err) {
      res.status(500).json({ msg: 'Internal Server Error', status: 500 })
    }
  }

  /**
   * Queued user removed by admin.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   * @returns {JSON} - Response data.
   */
  async ownerRemoveUserFromListingQueue (req, res, next) {
    try {
      const db = (await Listing.find({ _id: req.params.id })).map(L => ({
        queue: L.queue
      }))

      if (req.body.index > -1 && req.body.index < db[0].queue.length) {
        db[0].queue.splice(req.body.index, 1)
      } else {
        res.status(404).json({ msg: 'User not in queue', status: 404 })
      }

      await Listing.updateOne({ _id: req.params.id }, { queue: db[0].queue })

      res.status(200).json({ msg: 'User removed from queue', status: 200 })
    } catch (err) {
      res.status(500).json({ msg: 'Internal Server Error', status: 500 })
    }
  }
}
