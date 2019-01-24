const randomstring = require("randomstring")
const mailer = require("../../../lib/mail")

const User = require("../../../models/user")

module.exports = {
  async post(req, res) {
    try {
      const {
        email,
        phone,
        name
      } = req.body
      if (email === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field `email`" })
      if (name === undefined || name.first === undefined) return res.status(400).json({ error: true, reason: "Please specify First Name!" })
      const password = (req.body.password !== undefined)
        ? req.body.password
        : randomstring.generate(8) // auto-generated plaintext pass
      const user = await User.create({
        email,
        phone,
        password,
        name
      })
      delete user.password
      // Send welcome email, but NO WAITING!
      mailer("welcome", {
        to: email,
        subject: "Welcome!!!",
        locals: { email, password, name }
      })
      return res.json({ error: false, user })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  }
}
