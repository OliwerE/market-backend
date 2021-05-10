/**
 * Mongoose listing model.
 */

import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    required: true
  },
  listingType: {
    type: String,
    required: true,
    trim: true,
    required: true
  },
  productImage: {
    type: String,
    unique: true,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: String,
    trim: true,
    required: true
  }, 
}, {
  timestamps: true,
  versionKey: false
})

export const Listing = mongoose.model('Listing', schema)
