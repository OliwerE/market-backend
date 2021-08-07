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
   * @returns {JSON} - Response data.
   */
  async createListing (req, res, next) {
    try {
      const { title, productImage, description, category, listingType, price } = req.body

      // Categories will be stored in mongoDB and managed by an admin page in the future.
      if (!(category === 'electronics' || category === 'vehicles' || category === 'leisure' || category === 'household' || category === 'furnishings' || category === 'clothes' || category === 'toys' || category === 'other')) {
        return res.status(400).json({ msg: 'Invalid category', status: 400 })
      }

      if (title.trim().length > 0 && productImage.trim().length > 0 && description.trim().length > 0 && category.trim().length > 0 && price.trim().length > 0 && listingType.trim().length > 0) {
        const imageSize = (productImage.trim().length * (3 / 4)) - 2 // Converts base64 to bytes

        if (title.trim().length > 50 || description.trim().length > 5000 || price.trim().length > 20 || imageSize > 5000000) {
          return res.status(400).json({ msg: 'Text from input is too long.', status: 200 })
        }

        const createListing = new Listing({
          title,
          listingType,
          productImage,
          description,
          category,
          price,
          owner: req.session.user,
          queue: []
        })

        let newListingId
        await createListing.save().then(listing => {
          newListingId = listing._id
        })

        res.status(200).json({ msg: 'Listing created', status: 200, newListingId: newListingId })
      } else {
        res.status(400).json({ msg: 'Missing Data', status: 400 })
      }
    } catch (err) {
      res.status(500).json({ msg: 'Internal server error', status: 500 })
    }
  }

  /**
   * Updates a listing in the database.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   * @returns {JSON} - Response data.
   */
  async updateListing (req, res, next) {
    try {
      const { title, productImage, description, category, listingType, price } = req.body

      // Categories will be stored in mongoDB and managed by an admin page in the future.
      if (!(category === 'electronics' || category === 'vehicles' || category === 'leisure' || category === 'household' || category === 'furnishings' || category === 'clothes' || category === 'toys' || category === 'other')) {
        return res.status(400).json({ msg: 'Invalid category', status: 400 })
      }

      if (title.trim().length > 0 && productImage.trim().length > 0 && description.trim().length > 0 && category.trim().length > 0 && price.trim().length > 0 && listingType.trim().length > 0) {
        const imageSize = (productImage.trim().length * (3 / 4)) - 2 // Converts base64 to bytes
        if (title.trim().length > 50 || description.trim().length > 5000 || price.trim().length > 20 || imageSize > 5000000) {
          return res.status(400).json({ msg: 'Text from input is too long.', status: 200 })
        }
        const _res = res
        await Listing.updateOne({ _id: req.params.id }, { title, productImage, description, category, listingType, price }, (err, res) => {
          if (err) {
            _res.status(500).json({ msg: 'Internal Server Error', status: 500 })
          }
          if (res) {
            if (res.n === 0) {
              _res.status(500).json({ msg: 'Could not update snippet', status: 500 })
            } else if (res.n === 1) {
              _res.status(200).json({ msg: 'Listing has been updated', status: 500 })
            } else {
              _res.status(500).json({ msg: 'Internal Server Error', status: 500 })
            }
          }
        })
      } else {
        res.status(400).json({ msg: 'Missing Data', status: 400 })
      }
    } catch (err) {
      res.status(500).json({ msg: 'Internal Server Error', status: 500 })
    }
  }

  /**
   * Gets all buy listings.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   * @returns {JSON} - Response data.
   */
  async getBuyListings (req, res, next) {
    try {
      const pageSize = 8
      const page = parseInt(req.query.page || 0) // First 8 listings if query does not exist.
      const { category } = req.query
      if (!(category === 'electronics' || category === 'vehicles' || category === 'leisure' || category === 'household' || category === 'furnishings' || category === 'clothes' || category === 'toys' || category === 'other' || category === undefined)) {
        return res.status(400).json({ msg: 'Invalid category', status: 400 })
      }
      const findObj = {}
      if (category) {
        findObj.listingType = 'kop'
        findObj.category = category
      } else {
        findObj.listingType = 'kop'
      }

      const foundListings = (await Listing.find(findObj).sort({ createdAt: -1 }).limit(pageSize).skip(pageSize * page)).map(L => ({
        id: L._id,
        title: L.title,
        listingType: L.listingType,
        productImage: L.productImage,
        description: L.description,
        category: L.category,
        price: L.price
      }))

      // Number of pages
      const totalListings = await Listing.countDocuments(findObj)
      const totalPages = Math.ceil(totalListings / pageSize)

      res.status(200).json({ totalPages, foundListings })
    } catch (err) {
      res.status(500).json({ msg: 'Internal server error', status: 500 })
    }
  }

  /**
   * Gets all sell listings.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   * @returns {JSON} - Response data.
   */
  async getSellListings (req, res, next) {
    try {
      const pageSize = 8
      const page = parseInt(req.query.page || 0) // First 8 listings if no query.
      const { category } = req.query
      if (!(category === 'electronics' || category === 'vehicles' || category === 'leisure' || category === 'household' || category === 'furnishings' || category === 'clothes' || category === 'toys' || category === 'other' || category === undefined)) {
        return res.status(400).json({ msg: 'Invalid category', status: 400 })
      }
      const findObj = {}
      if (category) {
        findObj.listingType = 'salj'
        findObj.category = category
      } else if (category === undefined) {
        findObj.listingType = 'salj'
      } else {
        return res.status(400).json({ msg: 'Invalid category', status: 400 })
      }

      const foundListings = (await Listing.find(findObj).sort({ createdAt: -1 }).limit(pageSize).skip(pageSize * page)).map(L => ({
        id: L._id,
        title: L.title,
        listingType: L.listingType,
        productImage: L.productImage,
        description: L.description,
        category: L.category,
        price: L.price
      }))

      // Number of pages
      const totalListings = await Listing.countDocuments(findObj)
      const totalPages = Math.ceil(totalListings / pageSize)

      res.status(200).json({ totalPages, foundListings })
    } catch (err) {
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
      const pageSize = 8
      const page = parseInt(req.query.page || 0) // First 8 if no query.
      const foundListings = (await Listing.find({ owner: req.session.user }).sort({ createdAt: -1 }).limit(pageSize).skip(pageSize * page)).map(L => ({
        id: L._id,
        title: L.title,
        listingType: L.listingType,
        productImage: L.productImage,
        description: L.description,
        category: L.category,
        price: L.price
      }))

      // Number of pages
      const totalListings = await Listing.countDocuments({ owner: req.session.user })
      const totalPages = Math.ceil(totalListings / pageSize)

      res.status(200).json({ totalPages, foundListings })
    } catch (err) {
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

      // User data for listing
      foundListing[0].phoneNumber = user.phoneNumber
      foundListing[0].email = user.email

      res.status(200).json({ foundListing })
    } catch (err) {
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
      const latestListings = (await Listing.find({}).sort({ createdAt: -1 }).limit(5)).map(L => ({
        id: L._id,
        title: L.title,
        listingType: L.listingType,
        productImage: L.productImage,
        price: L.price
      }))
      res.status(200).json({ data: latestListings })
    } catch (err) {
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
      await Listing.deleteOne({ _id: listingId })

      res.status(200).json({ msg: 'Listing has been removed', status: 200 })
    } catch (err) {
      res.status(500).json({ msg: 'Internal Server error', status: 500 })
    }
  }

  /**
   * Search listings based on listing type and query.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   * @returns {JSON} - Response data.
   */
  async searchListings (req, res, next) {
    try {
      const pageSize = 8
      const page = parseInt(req.query.page || 0) // First 8 listings if no query.
      const { listingType, query } = req.query

      if (listingType.trim().length > 1000) {
        return res.status(400).json({ msg: 'Param ListingType is too long', status: 400 })
      } else if (query.trim().length > 1000) {
        return res.status(400).json({ msg: 'Param query is too long', status: 400 })
      } else {
        if ((listingType === 'buy' || listingType === 'sell') && query.trim().length > 0) {
          let type = 'salj'
          if (listingType === 'buy') {
            type = 'kop'
          }

          const foundListings = (await Listing.find({ listingType: type, $text: { $search: query } }).sort({ createdAt: -1 }).limit(pageSize).skip(pageSize * page)).map(L => ({
            id: L._id,
            title: L.title,
            listingType: L.listingType,
            productImage: L.productImage,
            description: L.description,
            category: L.category,
            price: L.price
          }))

          // Number of pages
          const totalListings = await Listing.countDocuments({ listingType: type, $text: { $search: query } })
          const totalPages = Math.ceil(totalListings / pageSize)

          res.status(200).json({ totalPages, foundListings })
        } else {
          res.status(400).json({ msg: 'Missing query or listingType', status: 400 })
        }
      }
    } catch (err) {
      res.status(500).json({ msg: 'Internal Server Error', status: 500 })
    }
  }
}
