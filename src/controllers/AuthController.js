/**
 * Module represents the auth controller.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

import { User } from '../models/user-model.js'
import bcrypt from 'bcrypt'

/**
 * Class represents a controller used to render pages for users.
 */
export class AuthController {
  checkLoggedIn (req, res, next) {
    console.log(req.session.user)

    if (req.session.user) {
      return res.json({ msg: "user logged in!" })
    } else {
      return res.json({ msg: "user not logged in!" })
    }
  }

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
          res.json({ msg: " Logged In Successfully" }) // fix statuskod
        } else {
          console.log('Fel lösen')
          res.json({ msg: "Wrong password" }) // lägg till statuskod
        }
      } else {
        console.log('error flera users eller inga')
        res.json({ msg: "Login failed" })
      }
    } catch (err) {
      console.log(err)
      res.status(500).json({ msg: "Internal server error", status: 500 })
    }
    
  }

  async postRegister (req, res, next) {
    try {
      console.log('----register----')
      console.log(req.body)
      console.log('----/register----')

      const { firstname, lastname, username, phoneNumber, password, passwordRepeat, city } = req.body

      // fixa: kontrollera att inga form data är tomma här

      if (firstname, lastname, username, phoneNumber, password, passwordRepeat, city) {
        if (password === passwordRepeat) {
          // kontrollera unik anv namn
          console.log(username)
          const findUsers = await User.find({ username: username })
          console.log(findUsers)

          if (findUsers.length === 0) {
            console.log('ok att skapa user!')
            const createUser = new User({
            firstname,
            lastname,
            username,
            password: await bcrypt.hash(password, 8),
            phoneNumber,
            city
          })

          console.log(createUser)
          await createUser.save()

          // req.session.userName = username // om skapa session direkt!


            res.json({ msg: "User created, please login" }) // lägg till statuskod!
          } else {
            res.json({ msg: "User already exist" }) // lägg till statuskod!
          }
          // om ok lägg till användare i databasen
        } else {
          res.status(400).json({ msg: "Invalid data (password and repeat don't match!)", status: 400 }) // fixa msg och statuskod??
        }
      } else {
        res.status(400).json({ msg: "Invalid data", status: 400 })
      }
    } catch (err) {
      console.log(err)
      res.status(500).json({ msg: "internal server error", status: 500 }) // byt till createError!
    }
  }

  logout (req, res, next) {
    req.session.destroy()
    res.clearCookie(process.env.SESSION_NAME).json({ msg: "you have been logged out!" }) // fix statuskod
  }
}
