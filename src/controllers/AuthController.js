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
  postLogin (req, res, next) {
    const { username, password } = req.body
    
    // console.log('user: ', req.session.user)

    console.log(req.body)

    console.log(username, password)

    req.session.user = username // funk

    // req.session.user = 'test'

    res.json({ msg: " Logged In Successfully" })

    // res.json({ message: "login posted!", status: 200 })
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

  checkLoggedIn (req, res, next) {
    console.log(req.session.user)

    if (req.session.user) {
      return res.json({ msg: "user logged in!" })
    } else {
      return res.json({ msg: "user not logged in!" })
    }
  }
}
