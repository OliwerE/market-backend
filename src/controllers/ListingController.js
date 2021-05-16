/**
 * Module represents the listing controller.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

import { Listing } from '../models/listing-model.js'

/**
 * Class represents a controller used to render pages for users.
 */
export class ListingController {
  async createListing (req, res, next) {
    console.log('börjar skapa listing!')
    try {
      const {title, productImage, description, category, listingType, price} = req.body

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
              var newListingId
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

  async getSellListings (req, res, next) {
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
          price: L.price
      }))

      res.status(200).json({ foundListing })

    } catch (err) {
      console.log(err)
      res.status(500).json({ msg: 'Internal server error', status: 500 })
    }
  }

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
}