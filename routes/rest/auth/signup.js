const randomstring = require("randomstring")
const mailer = require("../../../lib/mail")

const User = require("../../../models/user")

module.exports = {
  async post(req, res) {
    try {
      const {
        email,
        phone,
        name,
        password
      } = req.body
      if (email === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field `email`" })
      if (name === undefined || name.first === undefined) return res.status(400).json({ error: true, reason: "Please specify First Name!" })
      let user = await User.create({
        email,
        phone,
        password,
        name
      })
      user = user.toObject()
      delete user.password
      delete user.forgotpassword

      return res.json({ error: false, user })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  }
}
