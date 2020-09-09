const needle = require("needle")
const jwt = require("jsonwebtoken")

const User = require("../../../models/user")

async function getFacebookProfile(token) {
  const fbUrl = `https://graph.facebook.com/v2.10/me?fields=name,email&access_token=${token}`
  let resp
  try {
    resp = await needle("get", fbUrl)
  } catch (err) {
    throw new Error("Unable to access facebook account")
  }
  if (!(
    resp.body !== undefined
    && resp.body.id !== undefined
    && resp.body.email !== undefined
    && resp.body.name !== undefined
  )) throw new Error("Unable to access facebook account")

  return {
    facebookId: resp.body.id,
    fbName: {
      first: resp.body.name.split(" ")[0],
      last: resp.body.name.split(" ").splice(1).join(" ")
    },
    fbEmail: resp.body.email
  }
}

async function getGoogleProfile(token) {
  const googleUrl = "https://www.googleapis.com/oauth2/v2/userinfo"
  const options = {
    headers: { Authorization: `Bearer ${token}` }
  }
  let resp
  try {
    resp = await needle("get", googleUrl, options)
  } catch (err) {
    throw new Error("Unable to access google account")
  }
  if (!(
    resp.body !== undefined
    && resp.body.id !== undefined
    && resp.body.email !== undefined
    && resp.body.name !== undefined
  )) throw new Error("Unable to access google account")

  return {
    googleId: resp.body.id,
    googleName: {
      first: resp.body.name.split(" ")[0],
      last: resp.body.name.split(" ").splice(1).join(" ")
    },
    googleEmail: resp.body.email
  }
}

module.exports = {
  /**
   *
   * @api {post} /facebook User registration/login via Facebook
   * @apiName userRegistrationFacebook
   * @apiGroup Auth
   * @apiVersion  1.0.0
   * @apiPermission Public
   *
   *
   * @apiParam  {String} token
   *
   * @apiSuccess (200) {json} name description
   *
   * @apiParamExample  {json} Request-Example:
   * {
   *     "token": "acCvs34553"
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *     "error" : false,
   *     "token": "authToken.abc.xyz"
   * }
   *
   *
   */
  async authFb(req, res) {
    try {
      const {
        token: fbAccessToken
      } = req.body
      if (fbAccessToken === undefined) {
        return res
          .status(400)
          .json({ error: true, reason: "Missing manadatory field `token`" })
      }
      const { facebookId, fbName, fbEmail } = await getFacebookProfile(fbAccessToken)

      let user = await User.findOne({ $or: [{ email: fbEmail }, { facebookId }] }).exec()
      if (user === null) {
        // Create new user
        user = await User.create({
          email: fbEmail,
          name: fbName,
          accountType: "fb",
          facebookId
        })
      }

      if (user.isActive === false) throw new Error("User Inactive")
      const payload = {
        id: user._id,
        _id: user._id,
        fullName: user.name.full,
        email: user.email,
        phone: user.phone
      }

      const token = jwt.sign(payload, process.env.SECRET, {
        expiresIn: 3600 * 24 * 30 // 1 month
      })
      return res.json({ error: false, token })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },
  /**
   *
   * @api {post} /google User registration/login via Google
   * @apiName userRegistrationGoogle
   * @apiGroup Auth
   * @apiVersion  1.0.0
   * @apiPermission Public
   *
   *
   * @apiParam  {String} token
   *
   * @apiSuccess (200) {json} name description
   *
   * @apiParamExample  {json} Request-Example:
   * {
   *     "token": "acCvs34553"
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *     "error" : false,
   *     "token": "authToken.abc.xyz"
   * }
   *
   *
   */
  async authGoogle(req, res) {
    try {
      const {
        token: googleAccessToken
      } = req.body
      if (googleAccessToken === undefined) {
        return res
          .status(400)
          .json({ error: true, reason: "Missing manadatory field `token`" })
      }
      const { googleId, googleName, googleEmail } = await getGoogleProfile(googleAccessToken)

      let user = await User.findOne({ $or: [{ email: googleEmail }, { googleId }] }).exec()
      if (user === null) {
        // Create new user
        user = await User.create({
          email: googleEmail,
          name: googleName,
          accountType: "google",
          googleId
        })
      }

      if (user.isActive === false) throw new Error("User Inactive")
      const payload = {
        id: user._id,
        _id: user._id,
        fullName: user.name.full,
        email: user.email,
        phone: user.phone
      }

      const token = jwt.sign(payload, process.env.SECRET, {
        expiresIn: 3600 * 24 * 30 // 1 month
      })
      return res.json({ error: false, token })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  }
}
