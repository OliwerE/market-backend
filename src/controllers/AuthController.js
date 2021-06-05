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
    console.log(req.session.user)

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
    // res.json({ csrfToken: req.csrfToken() })
    res.cookie('XSRF-TOKEN', req.csrfToken(), { secure: true, domain: 'market-client-1dv613.netlify.app' }) // , { secure: true, sameSite: 'none' }
    res.json({})
  }

  /**
   * Validates login credentials and creates a new session.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   */
  async postLogin (req, res, next) {
    try {
      const { username, password } = req.body

      const findUser = await User.find({ username })

      console.log(findUser)

      if (findUser.length === 1 && findUser[0].username === username) {
        // jämför lösenord

        const isPassword = await bcrypt.compare(password, findUser[0].password)

        if (isPassword) {
          req.session.user = username
          res.status(200).json({ msg: ' Logged In Successfully', status: 200 })
        } else {
          console.log('Fel lösen')
          res.status(401).json({ msg: 'Wrong password', status: 401 })
        }
      } else {
        console.log('error flera users eller inga')
        res.status(401).json({ msg: 'Invalid credentials', status: 401 }) // 401 rätt status?
      }
    } catch (err) {
      console.log(err)
      res.status(500).json({ msg: 'Internal server error', status: 500 })
    }
  }

  /**
   * Creates a new user.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   */
  async postRegister (req, res, next) {
    try {
      console.log('----register----')
      console.log(req.body)
      console.log('----/register----')

      const { firstname, lastname, username, phoneNumber, password, city, email } = req.body

      // fixa: kontrollera att inga form data är tomma här

      if (firstname.trim().length > 0 && lastname.trim().length > 0 && username.trim().length > 0 && phoneNumber.trim().length > 0 && password.trim().length > 0 && email.trim().length > 0 && city.trim().length > 0) {
        if (isEmail.validate(email)) {
          // kontrollera unik anv namn
          console.log(username)
          const findUsers = await User.find({ username: username })
          console.log(findUsers)

          if (findUsers.length === 0) {
            console.log(firstname)
            const createUser = new User({
              firstname,
              lastname,
              username,
              password: await bcrypt.hash(password, 8),
              phoneNumber,
              city,
              email
            })

            console.log(createUser)
            await createUser.save()

            // req.session.userName = username // om skapa session direkt!
            res.status(200).json({ msg: 'User created, please login', status: 200 }) // lägg till statuskod!
          } else {
            res.status(409).json({ msg: 'User already exist', status: 409 }) // lägg till statuskod!
          }
        } else {
          res.status(400).json({ msg: 'Email not correct', status: 400 })
        }
      } else {
        res.status(400).json({ msg: 'Invalid data', status: 400 })
      }
    } catch (err) {
      console.log(err)
      res.status(500).json({ msg: 'internal server error', status: 500 }) // byt till createError!
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
    res.clearCookie(process.env.SESSION_NAME).json({ msg: 'you have been logged out!', successfulLogout: true }) // fix statuskod
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
    console.log(user)
    if (user.length === 1) {
      res.json(user[0])
    } else {
      // ERROR FIXA!
      console.log('error')
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
      console.log('profil uppdateras!')
      const { firstname, lastname, phoneNumber, city, email, password, newPassword } = req.body
      if (firstname.trim().length > 0 && lastname.trim().length > 0 && phoneNumber.toString().trim().length > 0 && email.trim().length > 0 && city.trim().length > 0) { // obs phonenumber ska ändras till string i db!
        // console.log(newPassword)

        const newData = {
          firstname,
          lastname,
          phoneNumber,
          city,
          email
        }

        if (newPassword) {
          const user = await User.find({ username: req.session.user })
          const isPassword = await bcrypt.compare(password, user[0].password)
          if (isPassword) {
            newData.password = await bcrypt.hash(newPassword, 8)
          } else {
            return res.status(400).json({ msg: 'Current password does not match password in database', status: 400 }) // Rätt statuskod??
          }
        } else {
          console.log('lösenord behöver inte uppdateras!')
        }

        await User.updateOne({ username: req.session.user }, newData)

        return res.status(200).json({ msg: 'User updated successfully', status: 200 }) // rätt statuskod??
      } else {
        return res.status(400).json({ msg: 'Missing key or keys in request!', status: 20400 })
      }
    } catch (err) {
      console.log(err)
      return res.status(500).json({ msg: 'Internal server error', status: 500 })
    }
  }
}
