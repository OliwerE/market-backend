/**
 * Module represents the listing controller.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

import { Listing } from '../models/listing-model.js'
import { User } from '../models/user-model.js'

import moment from 'moment'

/**
 * Class represents a controller used to render pages for users.
 */
export class ListingController {
  /**
   * Creates a new listing.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   */
  async createListing (req, res, next) {
    console.log('börjar skapa listing!')
    try {
      const { title, productImage, description, category, listingType, price } = req.body

      if (title.trim().length > 0 && productImage.trim().length > 0 && description.trim().length > 0 && category.trim().length > 0 && price.trim().length > 0 && listingType.trim().length > 0) {
        console.log('skapa annons')

        const createListing = new Listing({
          title,
          listingType,
          productImage,
          description,
          category,
          price,
          owner: req.session.user
        })

        console.log(createListing)
        let newListingId
        await createListing.save().then(listing => {
          newListingId = listing._id
        })

        res.status(200).json({ msg: 'Listing created', status: 200, newListingId: newListingId })
      } else {
        res.status(400).json({ msg: 'Missing Data', status: 400 }) // kontrollera statuskod!
      }

      // res.json('test') // fungerar!
    } catch (err) {
      console.log(err)
      res.status(500).json({ msg: 'Internal server error', status: 500 })
    }
  }

  /**
   * Gets all buy listings.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   */
  async getBuyListings (req, res, next) { // obs påminner mkt om getSellListings!
    try {
      const foundListings = (await Listing.find({ listingType: 'kop' })).map(L => ({
        id: L._id,
        title: L.title,
        listingType: L.listingType,
        productImage: L.productImage,
        description: L.description,
        category: L.category,
        price: L.price
      }))

      foundListings.reverse()
      res.status(200).json({ foundListings })
    } catch (err) {
      console.log(err)
      res.status(500).json({ msg: 'Internal server error', status: 500 })
    }
  }

  /**
   * Gets all sell listings.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   */
  async getSellListings (req, res, next) { // obs påminner mkt om getBuyListings!
    try {
      const foundListings = (await Listing.find({ listingType: 'salj' })).map(L => ({
        id: L._id,
        title: L.title,
        listingType: L.listingType,
        productImage: L.productImage,
        description: L.description,
        category: L.category,
        price: L.price
      }))

      foundListings.reverse()
      res.status(200).json({ foundListings })
    } catch (err) {
      console.log(err)
      res.status(500).json({ msg: 'Internal server error', status: 500 })
    }
  }

  /**
   * Gets all listings owned by the current session.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   */
  async getOwnListings (req, res, next) {
    try {
      const foundListings = (await Listing.find({ owner: req.session.user })).map(L => ({
        id: L._id,
        title: L.title,
        listingType: L.listingType,
        productImage: L.productImage,
        description: L.description,
        category: L.category,
        price: L.price
      }))

      res.status(200).json({ foundListings })
    } catch (err) {
      console.log(err)
      res.status(500).json({ msg: 'Internal server error', status: 500 })
    }
  }

  /**
   * Gets a listing by id.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   */
  async getListingById (req, res, next) {
    try {
      console.log(req.params.id)
      const foundListing = (await Listing.find({ _id: req.params.id })).map(L => ({
        id: L._id,
        title: L.title,
        listingType: L.listingType,
        productImage: L.productImage,
        description: L.description,
        category: L.category,
        price: L.price,
        owner: L.owner,
        isOwner: L.owner === req.session.user,
        date: moment(L.createdAt).fromNow()
      }))

      const user = (await User.findOne({ username: foundListing[0].owner }))

      foundListing[0].phoneNumber = user.phoneNumber
      foundListing[0].email = user.email

      res.status(200).json({ foundListing })
    } catch (err) {
      console.log(err)
      res.status(404).json({ msg: 'Listing not found', status: 404 })
    }
  }

  /**
   * Gets five latest listings.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   */
  async getLatestListings (req, res, next) {
    try {
      const latestListings = (await Listing.find({})).map(L => ({ // { listingType: 'salj' } obs ska hitta både köp och sälj!
        id: L._id,
        title: L.title,
        listingType: L.listingType,
        productImage: L.productImage,
        // description: L.description,
        // category: L.category,
        price: L.price
      }))

      // console.log(latestListings.slice(latestListings.length - 5).reverse())

      res.status(200).json(latestListings.slice(latestListings.length - 5).reverse())
    } catch (err) {
      console.log(err)
      res.status(500).json({ msg: 'Internal server error', status: 500 })
    }
  }

  /**
   * Deletes a listing.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   */
  async deleteListing (req, res, next) {
    try {
      const listingId = req.params.id
      const user = req.session.user
      const owner = (await Listing.findOne({ _id: listingId })).owner

      if (user === owner) {
        console.log('Är owner! tar bort!')

        await Listing.deleteOne({ _id: listingId })

        res.status(200).json({ msg: 'Listing has been removed', status: 200 })
        /*
        , (err, response) => {
          if (err) {
            res.status(500).json({ msg: 'Internal Server error', status: 500})
          } else if (response) {
            if (response.deletedCount === 0) {
              res.status(500).json({ msg: 'Could not remove listing', status: 500})
            } else if (response.deletedCount === 1) {
              res.status(200).json({ msg: 'Listing has been removed', status: 200})
            } else {
              res.status(500).json({ msg: 'Internal Server error', status: 500})
            }
          }
        }
        */
      } else {
        res.status(401).json({ msg: 'Not owner', status: 401 })
      }
    } catch (err) {
      console.error(err)
    }
  }
}
