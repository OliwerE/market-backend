/**
 * Module represents the queue controller.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Class represents a controller used to render pages for users.
 */
export class QueueController {
  getQueueById (req, res, next) {
    res.json({ msg: 'queue test' })
  }
}