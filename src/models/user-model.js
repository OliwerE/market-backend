/**
 * Mongoose user model.
 */

import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,
    required: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  phoneNumber: {
    type: Number,
    required: true
  },
  password: {
    type: String,
    minlength: 5,
    required: true
  },
  city: {
    type: String,
    trim: true,
    required: true
  }, 
  email: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
})

export const User = mongoose.model('User', schema)
