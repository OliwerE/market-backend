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
    try {
      const {title, productImage, description, category, listingType, price} = req.body

      if (title.trim().length > 0 /* fixa: || productImage.length > 0 */&& description.trim().length > 0 && category.trim().length > 0 && price.trim().length > 0 && listingType.trim().length > 0) {
        console.log('skapa annons')

        const createListing = new Listing({
                title,
                listingType,
                productImage,
                description,
                category,
                price
              })

              console.log(createListing)
              await createListing.save()

              res.status(200).json({ msg: 'Listing created', status: 200 })
        
      } else {
        res.status(400).json({ msg: 'Missing Data', status: 400 }) // kontrollera statuskod!
      }

      // res.json('test') // fungerar!
    } catch (err) {
      console.log(err)
      res.status(500).json({ msg: 'Internal server error', status: 500 })
    }
  }
}