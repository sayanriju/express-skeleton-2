const User = require("../../models/user")

module.exports = {
  /**
   *
   * @api {get} /users User list
   * @apiName userList
   * @apiGroup user
   * @apiVersion  1.0.0
   * @apiPermission User
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   *
   * @apiSuccess (200) {json} name description
   *
   *
   * @apiSuccessExample {type} Success-Response:
   * {
   *     "error" : false,
   *     "users" : [{
   *          "email" : "myEmail@logic-square.com",
   *          "phone" : "00000000000",
   *          "name"  :{
   *                "first":"Jhon",
   *                "last" :"Doe"
   *      }]
   * }
   *
   *
   */
  async find(req, res) {
    try {
      const users = await User.find({})
        .select("-password -forgotpassword")
        .exec()
      return res.json({ error: false, users })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   *
   * @api {get} /user/:id User Details
   * @apiName userDetails
   * @apiGroup user
   * @apiVersion  1.0.0
   * @apiPermission User
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id Users unique ID.
   *
   * @apiSuccess (200) {json} name description
   *
   *
   * @apiSuccessExample {type} Success-Response:
   * {
   *     "error" : false,
   *     "users" : [
   *          "email" : "myEmail@logic-square.com",
   *          "phone" : "00000000000",
   *          "name"  :{
   *                "first":"Jhon",
   *                "last" :"Doe"
   *      ]
   * }
   *
   *
   */
  async get(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.id })
        .select("-password -forgotpassword")
        .exec()
      return res.json({ error: false, user })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   *
   * @api {post} /user User manual instert
   * @apiName userManualInsert
   * @apiGroup user
   * @apiVersion  1.0.0
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   *
   * @apiParam  {String} email
   * @apiParam  {String} phone
   * @apiParam  {Object} name
   * @apiParam  {String} password
   *
   * @apiSuccess (200) {json} name description
   *
   * @apiParamExample  {json} Request-Example:
   * {
   *     "email" : "myEmail@logic-square.com",
   *     "phone" : "00000000000",
   *     "name"  :{
   *          "first":"Jhon",
   *          "last" :"Doe"
   *      },
   *      "isActive" : true
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *     "error" : false,
   *     "user" : {
   *          "email" : "myEmail@logic-square.com",
   *          "phone" : "00000000000",
   *          "name"  :{
   *              "first":"Jhon",
   *              "last" :"Doe"
   *           },
   *          "isActive" : true,
   *          "password" : "myPass"
   *      }
   * }
   *
   *
   */
  async post(req, res) {
    try {
      const {
        email, phone, password, isActive, name
      } = req.body
      if (email === undefined) {
        return res
          .status(400)
          .json({ error: true, reason: "Missing manadatory field `email`" })
      }
      if (password === undefined) {
        return res
          .status(400)
          .json({ error: true, reason: "Missing manadatory field `password`" })
      }
      let user = await User.create({
        email,
        phone,
        password,
        isActive,
        name
      })
      user = user.toObject()
      delete user.password
      delete user.forgotpassword
      return res.json({ error: false, user })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   *
   * @api {put} /user/:id User update, one or multiple fields
   * @apiName userUpdate
   * @apiGroup user
   * @apiVersion  1.0.0
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   *
   * @apiParam {String} id Users unique ID.
   *
   * @apiSuccess (200) {json} name description
   *
   * @apiParamExample  {json} Request-Example:
   * {
   *     "email" : "myEmail@logic-square.com",
   *     "phone" : "00000000000",
   *     "name"  :{
   *          "first":"Jhon",
   *          "last" :"Doe"
   *      },
   *      "isActive" : true
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *     "error" : false,
   *     "user" : {
   *          "email" : "myEmail@logic-square.com",
   *          "phone" : "00000000000",
   *          "name"  :{
   *              "first":"Jhon",
   *              "last" :"Doe"
   *           },
   *          "isActive" : true,
   *          "password" : "myPass"
   *      }
   * }
   *
   *
   */
  async put(req, res) {
    try {
      const {
        phone, password, isActive, name
      } = req.body
      const user = await User.findOne({ _id: req.params.id }).exec()
      if (user === null) return res.status(400).json({ error: true, reason: "No such User!" })
      if (phone !== undefined) user.phone = phone
      if (password !== undefined) user.password = password
      if (isActive !== undefined && typeof isActive === "boolean") user.isActive = isActive
      // if (name !== undefined && (name.first !== undefined || name.last !== undefined)) user.name = {}
      if (name !== undefined && name.first !== undefined) user.name.first = name.first
      if (name !== undefined && name.last !== undefined) user.name.last = name.last
      let updatedUser = await user.save()
      updatedUser = updatedUser.toObject()
      delete updatedUser.password
      delete updatedUser.forgotpassword
      return res.json({ error: false, user: updatedUser })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   *
   * @api {delete} /user/:id User delete
   * @apiName userDelete
   * @apiGroup user
   * @apiVersion  1.0.0
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   *
   * @apiParam {String} id Users unique ID.
   *
   * @apiSuccess (200) {json} name description
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *     "error" : false
   * }
   *
   *
   */
  async delete(req, res) {
    try {
      await User.deleteOne({ _id: req.params.id })
      return res.json({ error: false })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  }
}
