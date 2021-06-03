/**
 * Module represents the queue controller.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

import { Listing } from '../models/listing-model.js'

/**
 * Class represents a controller used to render pages for users.
 */
export class QueueController {
  async getQueueById (req, res, next) {
    try {
      console.log('--queueby id startar--')
      console.log(req.params.id)
      const foundQueue = (await Listing.find({ _id: req.params.id })).map(L => ({
        queue: L.queue
      }))

      console.log(foundQueue[0])

      res.json(foundQueue[0])
    } catch (err) {
      res.status(500).json({ msg: 'Internal Server Error', status: 500 })
    }
  }
}