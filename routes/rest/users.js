const User = require("../../models/user")

module.exports = {

  async find(req, res) {
    try {
      const users = await User.find({}).select("-password -forgotpassword").exec()
      return res.json({ error: false, users })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },
  async get(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.id }).select("-password -forgotpassword").exec()
      return res.json({ error: false, user })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },
  async post(req, res) {
    try {
      const {
        email,
        phone,
        password,
        isActive,
        name
      } = req.body
      if (email === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field `email`" })
      if (password === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field `password`" })
      const user = await User.create({
        email,
        phone,
        password,
        isActive,
        name
      })
      delete user.password
      return res.json({ error: false, user })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },
  async put(req, res) {
    try {
      const {
        phone,
        password,
        isActive,
        name
      } = req.body
      const user = await User.findOne({ _id: req.params.id }).exec()
      if (user === null) return res.status(400).json({ error: true, reason: "No such User!" })
      if (phone !== undefined) user.phone = phone
      if (password !== undefined) user.password = password
      if (isActive !== undefined && typeof isActive === "boolean") user.isActive = isActive
      // if (name !== undefined && (name.first !== undefined || name.last !== undefined)) user.name = {}
      if (name !== undefined && name.first !== undefined) user.name.first = name.first
      if (name !== undefined && name.last !== undefined) user.name.last = name.last
      await user.save()
      return res.json({ error: false, user })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },
  async delete(req, res) {
    try {
      await User.deleteOne({ _id: req.params.id })
      return res.json({ error: false })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  }

}
