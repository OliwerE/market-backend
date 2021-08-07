/**
 * Module represents the auth controller.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

import { User } from '../models/user-model.js'
import bcrypt from 'bcrypt'
import isEmail from 'isemail'

/**
 * Class represents a controller used to render pages for users.
 */
export class AuthController {
  /**
   * Checks if a user is logged in.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   * @returns {JSON} - Response data.
   */
  checkLoggedIn (req, res, next) {
    if (req.session.user) {
      return res.json({ msg: 'user logged in!', isAuth: true, username: req.session.user })
    } else {
      return res.json({ msg: 'user not logged in!', isAuth: false })
    }
  }

  /**
   * Get new csrf token.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   */
  getCsrfToken (req, res, next) {
    res.json({ csrfToken: req.csrfToken() })
  }

  /**
   * Validates login credentials and creates a new session.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   * @returns {JSON} - Response data.
   */
  async postLogin (req, res, next) {
    try {
      const { username, password } = req.body

      if (username.trim().length > 20) {
        return res.status(400).json({ msg: 'Username too long', status: 400 })
      } else if (password.trim().length > 100) {
        return res.status(400).json({ msg: 'Password too long', status: 400 })
      }
      const findUser = await User.find({ username })

      if (findUser.length === 1 && findUser[0].username === username) {
        const isPassword = await bcrypt.compare(password, findUser[0].password)
        if (isPassword) {
          req.session.user = username
          res.status(200).json({ msg: ' Logged In Successfully', status: 200 })
        } else {
          res.status(401).json({ msg: 'Wrong password', status: 401 })
        }
      } else {
        res.status(401).json({ msg: 'Invalid credentials', status: 401 })
      }
    } catch (err) {
      res.status(500).json({ msg: 'Internal server error', status: 500 })
    }
  }

  /**
   * Creates a new user.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   * @returns {JSON} - Response data.
   */
  async postRegister (req, res, next) {
    try {
      const { firstname, lastname, username, phoneNumber, password, city, email } = req.body

      if (firstname.trim().length > 0 && lastname.trim().length > 0 && username.trim().length > 0 && phoneNumber.trim().length > 0 && password.trim().length > 0 && email.trim().length > 0 && city.trim().length > 0) {
        if (firstname.trim().length > 1000 || lastname.trim().length > 1000 || username.trim().length > 20 || phoneNumber.trim().length > 1000 || password.trim().length > 100 || email.trim().length > 1000 || city.trim().length > 1000) {
          return res.status(400).json({ msg: 'Ett eller flera fält innehåller för många tecken', status: 400 })
        }

        if (isEmail.validate(email)) {
          const findUsers = await User.find({ username: username })

          if (findUsers.length === 0) {
            const createUser = new User({
              firstname,
              lastname,
              username,
              password: await bcrypt.hash(password, 8),
              phoneNumber,
              city,
              email
            })

            await createUser.save()

            res.status(200).json({ msg: 'User created, please login', status: 200 })
          } else {
            res.status(409).json({ msg: 'User already exist', status: 409 })
          }
        } else {
          res.status(400).json({ msg: 'Email not correct', status: 400 })
        }
      } else {
        res.status(400).json({ msg: 'Invalid data', status: 400 })
      }
    } catch (err) {
      res.status(500).json({ msg: 'internal server error', status: 500 })
    }
  }

  /**
   * Logs out user.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   */
  logout (req, res, next) {
    req.session.destroy()
    res.clearCookie(process.env.SESSION_NAME).json({ msg: 'you have been logged out!', successfulLogout: true })
  }

  /**
   * Gets username from the session user.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   */
  getUsername (req, res, next) {
    res.json({ username: req.session.user })
  }

  /**
   * Gets user profile data.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   */
  async getUserProfile (req, res, next) {
    const user = (await User.find({ username: req.session.user })).map(U => ({
      username: U.username,
      firstname: U.firstname,
      lastname: U.lastname,
      phoneNumber: U.phoneNumber,
      email: U.email,
      city: U.city
    }))
    if (user.length === 1) {
      res.json(user[0])
    } else {
      res.status(500).json({ msg: 'Internal server error', status: 500 })
    }
  }

  /**
   * Updates a user profile.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   * @returns {JSON} - Response data.
   */
  async postUpdateProfile (req, res, next) {
    try {
      const { firstname, lastname, phoneNumber, city, email, password, newPassword } = req.body
      if (firstname.trim().length > 0 && lastname.trim().length > 0 && phoneNumber.toString().trim().length > 0 && email.trim().length > 0 && city.trim().length > 0) {
        if (firstname.trim().length > 1000 || lastname.trim().length > 1000 || phoneNumber.toString().trim().length > 1000 || email.trim().length > 0 || city.trim().length > 1000) {
          return res.status(400).json({ msg: 'Ett eller flera fält innehåller för många tecken', status: 400 })
        }

        const newData = {
          firstname,
          lastname,
          phoneNumber,
          city,
          email
        }

        if (newPassword) {
          if (newPassword.trim().length > 100 || password.trim().length > 100) {
            return res.status(400).json({ msg: 'Ett eller flera fält innehåller för många tecken', status: 400 })
          }
          const user = await User.find({ username: req.session.user })
          const isPassword = await bcrypt.compare(password, user[0].password)
          if (isPassword) {
            newData.password = await bcrypt.hash(newPassword, 8)
          } else {
            return res.status(400).json({ msg: 'Current password does not match password in database', status: 400 })
          }
        }

        await User.updateOne({ username: req.session.user }, newData)

        return res.status(200).json({ msg: 'User updated successfully', status: 200 })
      } else {
        return res.status(400).json({ msg: 'Missing key or keys in request!', status: 20400 })
      }
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', status: 500 })
    }
  }
}
